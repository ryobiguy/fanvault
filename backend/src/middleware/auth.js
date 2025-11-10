import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: { message: 'Access token required' } });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await pool.query(
      'SELECT id, email, user_type, is_verified, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: { message: 'Account is deactivated' } });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: { message: 'Invalid token' } });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: { message: 'Token expired' } });
    }
    return res.status(500).json({ error: { message: 'Authentication error' } });
  }
};

export const requireCreator = (req, res, next) => {
  if (req.user.user_type !== 'creator') {
    return res.status(403).json({ error: { message: 'Creator access required' } });
  }
  next();
};

export const requireFan = (req, res, next) => {
  if (req.user.user_type !== 'fan') {
    return res.status(403).json({ error: { message: 'Fan access required' } });
  }
  next();
};

export const requireActiveSubscription = async (req, res, next) => {
  try {
    if (req.user.user_type !== 'creator') {
      return next();
    }

    const result = await pool.query(
      'SELECT status FROM creator_subscriptions WHERE creator_id = $1 AND status = $2',
      [req.user.id, 'active']
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ 
        error: { message: 'Active creator subscription required (£10/month)' } 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: { message: 'Subscription check error' } });
  }
};
