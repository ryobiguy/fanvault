import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken, requireCreator } from '../middleware/auth.js';

const router = express.Router();

// Create content post
router.post('/', authenticateToken, requireCreator,
  [
    body('contentType').isIn(['image', 'video', 'text']),
    body('caption').optional().trim().isLength({ max: 2000 }),
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

      const { contentType, caption, isPaid, price, mediaUrls } = req.body;

      if (isPaid && !price) {
        return res.status(400).json({ error: { message: 'Price required for paid content' } });
      }

      const result = await pool.query(
        `INSERT INTO content_posts 
         (creator_id, content_type, caption, is_paid, price, media_urls)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [req.user.id, contentType, caption || '', isPaid, isPaid ? price : null, mediaUrls || []]
      );

      res.status(201).json({
        message: 'Content created successfully',
        content: result.rows[0]
      });
    } catch (error) {
      console.error('Create content error:', error);
      res.status(500).json({ error: { message: 'Failed to create content' } });
    }
  }
);

// Get content feed (for fans)
// NOTE: For now, this returns all published content regardless of subscription,
// and uses isLocked to indicate paywalled posts. We can re-introduce the
// subscription filter once fan_subscriptions are fully wired into the UI.
router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT cp.*, 
              p.display_name as creator_name, 
              p.username as creator_username,
              p.avatar_url as creator_avatar,
              EXISTS(SELECT 1 FROM likes WHERE user_id = $1 AND content_id = cp.id) as is_liked,
              EXISTS(SELECT 1 FROM content_purchases WHERE fan_id = $1 AND content_id = cp.id) as is_purchased
       FROM content_posts cp
       JOIN profiles p ON cp.creator_id = p.user_id
       ORDER BY cp.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.json({
      posts: result.rows.map(post => ({
        ...post,
        isLocked: post.is_paid && !post.is_purchased
      }))
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: { message: 'Failed to get feed' } });
  }
});

// Get creator's content
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT cp.id, cp.content_type, cp.caption, cp.is_paid, cp.price, 
              cp.thumbnail_url, cp.view_count, cp.like_count, cp.created_at
       FROM content_posts cp
       WHERE cp.creator_id = $1 AND cp.is_published = true
       ORDER BY cp.created_at DESC
       LIMIT $2 OFFSET $3`,
      [creatorId, limit, offset]
    );

    res.json({ posts: result.rows });
  } catch (error) {
    console.error('Get creator content error:', error);
    res.status(500).json({ error: { message: 'Failed to get content' } });
  }
});

// Get single content post
router.get('/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;

    const result = await pool.query(
      `SELECT cp.*, 
              p.display_name as creator_name, 
              p.username as creator_username,
              p.avatar_url as creator_avatar,
              EXISTS(SELECT 1 FROM likes WHERE user_id = $1 AND content_id = cp.id) as is_liked,
              EXISTS(SELECT 1 FROM content_purchases WHERE fan_id = $1 AND content_id = cp.id) as is_purchased
       FROM content_posts cp
       JOIN profiles p ON cp.creator_id = p.user_id
       WHERE cp.id = $2`,
      [req.user.id, contentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Content not found' } });
    }

    const post = result.rows[0];

    // Check if user has access
    const hasAccess = !post.is_paid || post.is_purchased || post.creator_id === req.user.id;

    // Increment view count
    if (hasAccess) {
      await pool.query(
        'UPDATE content_posts SET view_count = view_count + 1 WHERE id = $1',
        [contentId]
      );
    }

    res.json({
      post: {
        ...post,
        isLocked: post.is_paid && !post.is_purchased && post.creator_id !== req.user.id,
        mediaUrls: hasAccess ? post.media_urls : []
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: { message: 'Failed to get content' } });
  }
});

// Like content
router.post('/:contentId/like', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;

    // Check if already liked
    const existing = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND content_id = $2',
      [req.user.id, contentId]
    );

    if (existing.rows.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND content_id = $2',
        [req.user.id, contentId]
      );
      await pool.query(
        'UPDATE content_posts SET like_count = like_count - 1 WHERE id = $1',
        [contentId]
      );
      return res.json({ message: 'Content unliked', liked: false });
    } else {
      // Like
      await pool.query(
        'INSERT INTO likes (user_id, content_id) VALUES ($1, $2)',
        [req.user.id, contentId]
      );
      await pool.query(
        'UPDATE content_posts SET like_count = like_count + 1 WHERE id = $1',
        [contentId]
      );
      return res.json({ message: 'Content liked', liked: true });
    }
  } catch (error) {
    console.error('Like content error:', error);
    res.status(500).json({ error: { message: 'Failed to like content' } });
  }
});

// Delete content (creator only)
router.delete('/:contentId', authenticateToken, requireCreator, async (req, res) => {
  try {
    const { contentId } = req.params;

    const result = await pool.query(
      'DELETE FROM content_posts WHERE id = $1 AND creator_id = $2 RETURNING id',
      [contentId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Content not found or unauthorized' } });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: { message: 'Failed to delete content' } });
  }
});

export default router;
