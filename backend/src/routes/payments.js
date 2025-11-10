import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Purchase PPV content
router.post('/purchase-content', authenticateToken,
  [
    body('contentId').isUUID(),
    body('amount').isFloat({ min: 0.50 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { contentId, amount } = req.body;

      // Check if already purchased
      const existing = await pool.query(
        'SELECT id FROM content_purchases WHERE fan_id = $1 AND content_id = $2',
        [req.user.id, contentId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: { message: 'Content already purchased' } });
      }

      // Get content details
      const contentResult = await pool.query(
        'SELECT * FROM content_posts WHERE id = $1',
        [contentId]
      );

      if (contentResult.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Content not found' } });
      }

      const content = contentResult.rows[0];

      if (!content.is_paid) {
        return res.status(400).json({ error: { message: 'This content is free' } });
      }

      if (parseFloat(amount) !== parseFloat(content.price)) {
        return res.status(400).json({ error: { message: 'Invalid amount' } });
      }

      // In production, process Stripe payment here
      // For demo, we'll just record the purchase

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Record purchase
        await client.query(
          `INSERT INTO content_purchases (fan_id, content_id, amount)
           VALUES ($1, $2, $3)`,
          [req.user.id, contentId, amount]
        );

        // Record transaction
        await client.query(
          `INSERT INTO transactions 
           (user_id, transaction_type, amount, status, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [req.user.id, 'content_purchase', amount, 'completed', 'Purchased PPV content']
        );

        // Credit creator (100% of earnings)
        await client.query(
          `INSERT INTO transactions 
           (user_id, transaction_type, amount, status, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [content.creator_id, 'content_sale', amount, 'completed', 'Content sale earnings']
        );

        await client.query('COMMIT');

        res.json({ 
          message: 'Content purchased successfully',
          unlocked: true
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Purchase content error:', error);
      res.status(500).json({ error: { message: 'Failed to purchase content' } });
    }
  }
);

// Purchase paid message
router.post('/purchase-message', authenticateToken,
  [
    body('messageId').isUUID(),
    body('amount').isFloat({ min: 0.50 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { messageId, amount } = req.body;

      // Check if already purchased
      const existing = await pool.query(
        'SELECT id FROM message_purchases WHERE fan_id = $1 AND message_id = $2',
        [req.user.id, messageId]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: { message: 'Message already purchased' } });
      }

      // Get message details
      const messageResult = await pool.query(
        'SELECT * FROM messages WHERE id = $1',
        [messageId]
      );

      if (messageResult.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Message not found' } });
      }

      const message = messageResult.rows[0];

      if (!message.is_paid) {
        return res.status(400).json({ error: { message: 'This message is free' } });
      }

      if (parseFloat(amount) !== parseFloat(message.price)) {
        return res.status(400).json({ error: { message: 'Invalid amount' } });
      }

      // In production, process Stripe payment here

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Record purchase
        await client.query(
          `INSERT INTO message_purchases (fan_id, message_id, amount)
           VALUES ($1, $2, $3)`,
          [req.user.id, messageId, amount]
        );

        // Unlock message
        await client.query(
          'UPDATE messages SET is_unlocked = true WHERE id = $1',
          [messageId]
        );

        // Record transaction
        await client.query(
          `INSERT INTO transactions 
           (user_id, transaction_type, amount, status, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [req.user.id, 'message_purchase', amount, 'completed', 'Purchased paid message']
        );

        // Credit creator (100% of earnings)
        await client.query(
          `INSERT INTO transactions 
           (user_id, transaction_type, amount, status, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [message.sender_id, 'message_sale', amount, 'completed', 'Paid message earnings']
        );

        await client.query('COMMIT');

        res.json({ 
          message: 'Message purchased successfully',
          unlocked: true
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Purchase message error:', error);
      res.status(500).json({ error: { message: 'Failed to purchase message' } });
    }
  }
);

// Get earnings (creator only)
router.get('/earnings', authenticateToken, async (req, res) => {
  try {
    if (req.user.user_type !== 'creator') {
      return res.status(403).json({ error: { message: 'Creator access required' } });
    }

    const result = await pool.query(
      `SELECT 
         SUM(CASE WHEN transaction_type IN ('content_sale', 'message_sale') THEN amount ELSE 0 END) as total_earnings,
         SUM(CASE WHEN transaction_type = 'content_sale' THEN amount ELSE 0 END) as content_earnings,
         SUM(CASE WHEN transaction_type = 'message_sale' THEN amount ELSE 0 END) as message_earnings,
         COUNT(DISTINCT CASE WHEN transaction_type IN ('content_sale', 'message_sale') THEN id END) as total_sales
       FROM transactions
       WHERE user_id = $1 AND status = 'completed'`,
      [req.user.id]
    );

    const earnings = result.rows[0];

    res.json({
      totalEarnings: parseFloat(earnings.total_earnings) || 0,
      contentEarnings: parseFloat(earnings.content_earnings) || 0,
      messageEarnings: parseFloat(earnings.message_earnings) || 0,
      totalSales: parseInt(earnings.total_sales) || 0
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ error: { message: 'Failed to get earnings' } });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: { message: 'Failed to get transactions' } });
  }
});

export default router;
