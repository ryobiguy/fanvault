import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile by username
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.user_type, 
              p.display_name, p.username, p.bio, p.avatar_url, p.cover_image_url, 
              p.location, p.website, p.is_verified,
              COUNT(DISTINCT fs.id) as subscriber_count
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN fan_subscriptions fs ON u.id = fs.creator_id AND fs.status = 'active'
       WHERE p.username = $1 AND u.is_active = true
       GROUP BY u.id, p.id`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    const user = result.rows[0];

    // Get subscription tiers if creator
    let tiers = [];
    if (user.user_type === 'creator') {
      const tiersResult = await pool.query(
        `SELECT id, tier_name, tier_level, price, description, benefits
         FROM subscription_tiers
         WHERE creator_id = $1 AND is_active = true
         ORDER BY tier_level`,
        [user.id]
      );
      tiers = tiersResult.rows;
    }

    res.json({
      profile: {
        id: user.id,
        userType: user.user_type,
        displayName: user.display_name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar_url,
        coverImage: user.cover_image_url,
        location: user.location,
        website: user.website,
        isVerified: user.is_verified,
        subscriberCount: parseInt(user.subscriber_count),
        subscriptionTiers: tiers
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: { message: 'Failed to get profile' } });
  }
});

// Update own profile
router.put('/profile', authenticateToken,
  [
    body('displayName').optional().trim().isLength({ min: 2, max: 100 }),
    body('bio').optional().trim().isLength({ max: 500 }),
    body('location').optional().trim().isLength({ max: 100 }),
    body('website').optional().trim().isURL()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { displayName, bio, location, website } = req.body;
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (displayName !== undefined) {
        updates.push(`display_name = $${paramCount++}`);
        values.push(displayName);
      }
      if (bio !== undefined) {
        updates.push(`bio = $${paramCount++}`);
        values.push(bio);
      }
      if (location !== undefined) {
        updates.push(`location = $${paramCount++}`);
        values.push(location);
      }
      if (website !== undefined) {
        updates.push(`website = $${paramCount++}`);
        values.push(website);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: { message: 'No updates provided' } });
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(req.user.id);

      const query = `
        UPDATE profiles 
        SET ${updates.join(', ')}
        WHERE user_id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      res.json({
        message: 'Profile updated successfully',
        profile: result.rows[0]
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: { message: 'Failed to update profile' } });
    }
  }
);

// Update subscription tiers (creators only)
router.put('/subscription-tiers', authenticateToken,
  [
    body('tiers').isArray({ min: 1, max: 3 }),
    body('tiers.*.tierLevel').isInt({ min: 1, max: 3 }),
    body('tiers.*.tierName').trim().isLength({ min: 1, max: 50 }),
    body('tiers.*.price').isFloat({ min: 0.50 }),
    body('tiers.*.description').optional().trim()
  ],
  async (req, res) => {
    try {
      if (req.user.user_type !== 'creator') {
        return res.status(403).json({ error: { message: 'Creator access required' } });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tiers } = req.body;
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Delete existing tiers
        await client.query(
          'DELETE FROM subscription_tiers WHERE creator_id = $1',
          [req.user.id]
        );

        // Insert new tiers
        const insertedTiers = [];
        for (const tier of tiers) {
          const result = await client.query(
            `INSERT INTO subscription_tiers 
             (creator_id, tier_name, tier_level, price, description)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user.id, tier.tierName, tier.tierLevel, tier.price, tier.description || '']
          );
          insertedTiers.push(result.rows[0]);
        }

        await client.query('COMMIT');

        res.json({
          message: 'Subscription tiers updated successfully',
          tiers: insertedTiers
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Update tiers error:', error);
      res.status(500).json({ error: { message: 'Failed to update subscription tiers' } });
    }
  }
);

// Get user settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Settings not found' } });
    }

    res.json({ settings: result.rows[0] });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: { message: 'Failed to get settings' } });
  }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const {
      emailNotifications,
      pushNotifications,
      profileVisibility,
      showOnlineStatus,
      allowMessagesFrom
    } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (emailNotifications !== undefined) {
      updates.push(`email_notifications = $${paramCount++}`);
      values.push(emailNotifications);
    }
    if (pushNotifications !== undefined) {
      updates.push(`push_notifications = $${paramCount++}`);
      values.push(pushNotifications);
    }
    if (profileVisibility !== undefined) {
      updates.push(`profile_visibility = $${paramCount++}`);
      values.push(profileVisibility);
    }
    if (showOnlineStatus !== undefined) {
      updates.push(`show_online_status = $${paramCount++}`);
      values.push(showOnlineStatus);
    }
    if (allowMessagesFrom !== undefined) {
      updates.push(`allow_messages_from = $${paramCount++}`);
      values.push(allowMessagesFrom);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: { message: 'No updates provided' } });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.id);

    const query = `
      UPDATE user_settings 
      SET ${updates.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      message: 'Settings updated successfully',
      settings: result.rows[0]
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: { message: 'Failed to update settings' } });
  }
});

// Search creators
router.get('/search', async (req, res) => {
  try {
    const { q, category, sortBy, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT u.id, u.user_type,
             p.display_name, p.username, p.bio, p.avatar_url, p.is_verified,
             COUNT(DISTINCT fs.id) as subscriber_count,
             MIN(st.price) as min_price
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN fan_subscriptions fs ON u.id = fs.creator_id AND fs.status = 'active'
      LEFT JOIN subscription_tiers st ON u.id = st.creator_id AND st.is_active = true
      WHERE u.user_type = 'creator' AND u.is_active = true
    `;

    const values = [];
    let paramCount = 1;

    if (q) {
      query += ` AND (p.display_name ILIKE $${paramCount} OR p.username ILIKE $${paramCount} OR p.bio ILIKE $${paramCount})`;
      values.push(`%${q}%`);
      paramCount++;
    }

    query += ` GROUP BY u.id, p.id`;

    // Sorting
    if (sortBy === 'subscribers') {
      query += ` ORDER BY subscriber_count DESC`;
    } else if (sortBy === 'price') {
      query += ` ORDER BY min_price ASC`;
    } else {
      query += ` ORDER BY subscriber_count DESC`; // Default to trending
    }

    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    res.json({
      creators: result.rows.map(row => ({
        id: row.id,
        displayName: row.display_name,
        username: row.username,
        bio: row.bio,
        avatar: row.avatar_url,
        isVerified: row.is_verified,
        subscriberCount: parseInt(row.subscriber_count),
        minPrice: parseFloat(row.min_price) || 0
      })),
      total: result.rows.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: { message: 'Search failed' } });
  }
});

export default router;
