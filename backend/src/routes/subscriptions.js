import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Subscribe to creator
router.post('/subscribe', authenticateToken,
  [
    body('creatorId').isUUID(),
    body('tierId').isUUID()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { creatorId, tierId } = req.body;

      if (req.user.user_type !== 'fan') {
        return res.status(403).json({ error: { message: 'Only fans can subscribe to creators' } });
      }

      // Check if already subscribed
      const existing = await pool.query(
        'SELECT id FROM fan_subscriptions WHERE fan_id = $1 AND creator_id = $2 AND status = $3',
        [req.user.id, creatorId, 'active']
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: { message: 'Already subscribed to this creator' } });
      }

      // Get tier details
      const tierResult = await pool.query(
        'SELECT * FROM subscription_tiers WHERE id = $1 AND creator_id = $2',
        [tierId, creatorId]
      );

      if (tierResult.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Subscription tier not found' } });
      }

      const tier = tierResult.rows[0];

      // In production, this would create a Stripe subscription
      // For now, we'll create a demo subscription
      const result = await pool.query(
        `INSERT INTO fan_subscriptions 
         (fan_id, creator_id, tier_id, status, current_period_start, current_period_end)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month')
         RETURNING *`,
        [req.user.id, creatorId, tierId, 'active']
      );

      // Create transaction record
      await pool.query(
        `INSERT INTO transactions 
         (user_id, transaction_type, amount, status, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [req.user.id, 'subscription', tier.price, 'completed', `Subscribed to creator - ${tier.tier_name} tier`]
      );

      res.status(201).json({
        message: 'Subscribed successfully',
        subscription: result.rows[0]
      });
    } catch (error) {
      console.error('Subscribe error:', error);
      res.status(500).json({ error: { message: 'Failed to subscribe' } });
    }
  }
);

// Unsubscribe from creator
router.post('/unsubscribe/:creatorId', authenticateToken, async (req, res) => {
  try {
    const { creatorId } = req.params;

    const result = await pool.query(
      `UPDATE fan_subscriptions 
       SET status = 'canceled'
       WHERE fan_id = $1 AND creator_id = $2 AND status = 'active'
       RETURNING *`,
      [req.user.id, creatorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Subscription not found' } });
    }

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: { message: 'Failed to unsubscribe' } });
  }
});

// Get user's subscriptions
router.get('/my-subscriptions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT fs.*, 
              p.display_name as creator_name,
              p.username as creator_username,
              p.avatar_url as creator_avatar,
              st.tier_name,
              st.price
       FROM fan_subscriptions fs
       JOIN profiles p ON fs.creator_id = p.user_id
       JOIN subscription_tiers st ON fs.tier_id = st.id
       WHERE fs.fan_id = $1
       ORDER BY fs.created_at DESC`,
      [req.user.id]
    );

    res.json({ subscriptions: result.rows });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: { message: 'Failed to get subscriptions' } });
  }
});

// Get creator's subscribers
router.get('/my-subscribers', authenticateToken, async (req, res) => {
  try {
    if (req.user.user_type !== 'creator') {
      return res.status(403).json({ error: { message: 'Creator access required' } });
    }

    const result = await pool.query(
      `SELECT fs.*,
              p.display_name as fan_name,
              p.username as fan_username,
              p.avatar_url as fan_avatar,
              st.tier_name,
              st.price
       FROM fan_subscriptions fs
       JOIN profiles p ON fs.fan_id = p.user_id
       JOIN subscription_tiers st ON fs.tier_id = st.id
       WHERE fs.creator_id = $1 AND fs.status = 'active'
       ORDER BY fs.created_at DESC`,
      [req.user.id]
    );

    res.json({ 
      subscribers: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: { message: 'Failed to get subscribers' } });
  }
});

// Check subscription status
router.get('/status/:creatorId', authenticateToken, async (req, res) => {
  try {
    const { creatorId } = req.params;

    const result = await pool.query(
      `SELECT fs.*, st.tier_name, st.price
       FROM fan_subscriptions fs
       JOIN subscription_tiers st ON fs.tier_id = st.id
       WHERE fs.fan_id = $1 AND fs.creator_id = $2 AND fs.status = 'active'`,
      [req.user.id, creatorId]
    );

    if (result.rows.length === 0) {
      return res.json({ subscribed: false });
    }

    res.json({ 
      subscribed: true,
      subscription: result.rows[0]
    });
  } catch (error) {
    console.error('Check subscription error:', error);
    res.status(500).json({ error: { message: 'Failed to check subscription' } });
  }
});

export default router;
