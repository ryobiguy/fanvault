import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('userType').isIn(['creator', 'fan']),
    body('displayName').trim().isLength({ min: 2, max: 100 }),
    body('username').trim().isLength({ min: 3, max: 50 }).matches(/^[a-zA-Z0-9_]+$/)
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, userType, displayName, username } = req.body;

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: { message: 'Email already registered' } });
      }

      // Check if username exists
      const existingUsername = await pool.query(
        'SELECT id FROM profiles WHERE username = $1',
        [username]
      );

      if (existingUsername.rows.length > 0) {
        return res.status(400).json({ error: { message: 'Username already taken' } });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Start transaction
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Create user
        const userResult = await client.query(
          'INSERT INTO users (email, password_hash, user_type) VALUES ($1, $2, $3) RETURNING id, email, user_type',
          [email, passwordHash, userType]
        );

        const user = userResult.rows[0];

        // Create profile
        await client.query(
          'INSERT INTO profiles (user_id, display_name, username) VALUES ($1, $2, $3)',
          [user.id, displayName, username]
        );

        // Create default settings
        await client.query(
          'INSERT INTO user_settings (user_id) VALUES ($1)',
          [user.id]
        );

        // If creator, create default subscription tiers
        if (userType === 'creator') {
          const tiers = [
            { level: 1, name: 'Basic', price: 9.99, description: 'Access to all my content' },
            { level: 2, name: 'Premium', price: 19.99, description: 'Everything in Basic + exclusive content' },
            { level: 3, name: 'VIP', price: 49.99, description: 'Everything + 1-on-1 messaging' }
          ];

          for (const tier of tiers) {
            await client.query(
              'INSERT INTO subscription_tiers (creator_id, tier_name, tier_level, price, description) VALUES ($1, $2, $3, $4, $5)',
              [user.id, tier.name, tier.level, tier.price, tier.description]
            );
          }
        }

        await client.query('COMMIT');

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: user.id,
            email: user.email,
            userType: user.user_type,
            displayName,
            username
          }
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: { message: 'Registration failed' } });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Get user
      const result = await pool.query(
        `SELECT u.id, u.email, u.password_hash, u.user_type, u.is_active, 
                p.display_name, p.username, p.avatar_url
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: { message: 'Invalid credentials' } });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({ error: { message: 'Account is deactivated' } });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: { message: 'Invalid credentials' } });
      }

      // Generate token
      const token = generateToken(user.id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          userType: user.user_type,
          displayName: user.display_name,
          username: user.username,
          avatar: user.avatar_url
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: { message: 'Login failed' } });
    }
  }
);

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: { message: 'Access token required' } });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT u.id, u.email, u.user_type, 
              p.display_name, p.username, p.bio, p.avatar_url, p.cover_image_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        displayName: user.display_name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar_url,
        coverImage: user.cover_image_url
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: { message: 'Failed to get user' } });
  }
});

export default router;
