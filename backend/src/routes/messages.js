import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Send message
router.post('/', authenticateToken,
  [
    body('recipientId').isUUID(),
    body('content').optional().trim().isLength({ max: 2000 }),
    body('isPaid').isBoolean(),
    body('price').optional().isFloat({ min: 0.50 }),
    body('mediaUrls').optional().isArray()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { recipientId, content, isPaid, price, mediaUrls } = req.body;

      if (isPaid && !price) {
        return res.status(400).json({ error: { message: 'Price required for paid messages' } });
      }

      // Check if recipient exists
      const recipientCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1 AND is_active = true',
        [recipientId]
      );

      if (recipientCheck.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Recipient not found' } });
      }

      const result = await pool.query(
        `INSERT INTO messages 
         (sender_id, recipient_id, content, is_paid, price, media_urls, is_unlocked)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [req.user.id, recipientId, content || '', isPaid, isPaid ? price : null, mediaUrls || [], !isPaid]
      );

      res.status(201).json({
        message: 'Message sent successfully',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: { message: 'Failed to send message' } });
    }
  }
);

// Get conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (other_user_id)
              other_user_id,
              p.display_name,
              p.username,
              p.avatar_url,
              last_message,
              last_message_time,
              unread_count
       FROM (
         SELECT 
           CASE 
             WHEN sender_id = $1 THEN recipient_id 
             ELSE sender_id 
           END as other_user_id,
           content as last_message,
           created_at as last_message_time,
           (SELECT COUNT(*) FROM messages 
            WHERE recipient_id = $1 
            AND sender_id = CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END
            AND is_read = false) as unread_count
         FROM messages
         WHERE sender_id = $1 OR recipient_id = $1
         ORDER BY created_at DESC
       ) conv
       JOIN profiles p ON conv.other_user_id = p.user_id
       ORDER BY other_user_id, last_message_time DESC`,
      [req.user.id]
    );

    res.json({ conversations: result.rows });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: { message: 'Failed to get conversations' } });
  }
});

// Get messages with specific user
router.get('/thread/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT m.*,
              p.display_name as sender_name,
              p.avatar_url as sender_avatar,
              EXISTS(SELECT 1 FROM message_purchases WHERE fan_id = $1 AND message_id = m.id) as is_purchased
       FROM messages m
       JOIN profiles p ON m.sender_id = p.user_id
       WHERE (m.sender_id = $1 AND m.recipient_id = $2)
          OR (m.sender_id = $2 AND m.recipient_id = $1)
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
      [req.user.id, userId, limit, offset]
    );

    // Mark messages as read
    await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE recipient_id = $1 AND sender_id = $2 AND is_read = false`,
      [req.user.id, userId]
    );

    res.json({
      messages: result.rows.map(msg => ({
        ...msg,
        isLocked: msg.is_paid && !msg.is_unlocked && !msg.is_purchased && msg.sender_id !== req.user.id,
        mediaUrls: (msg.is_paid && !msg.is_purchased && msg.sender_id !== req.user.id) ? [] : msg.media_urls
      }))
    });
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({ error: { message: 'Failed to get messages' } });
  }
});

// Mark message as read
router.put('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    await pool.query(
      'UPDATE messages SET is_read = true WHERE id = $1 AND recipient_id = $2',
      [messageId, req.user.id]
    );

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: { message: 'Failed to mark message as read' } });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING id',
      [messageId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Message not found or unauthorized' } });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: { message: 'Failed to delete message' } });
  }
});

export default router;
