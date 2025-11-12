import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import stripe from '../config/stripe.js';

const router = express.Router();

// Create Stripe checkout session for creator subscription
router.post('/create-creator-subscription', authenticateToken, async (req, res) => {
  try {
    if (req.user.user_type !== 'creator') {
      return res.status(403).json({ error: { message: 'Creator access required' } });
    }

    // Check if already subscribed
    const existingSub = await pool.query(
      'SELECT * FROM creator_subscriptions WHERE creator_id = $1 AND status = $2',
      [req.user.id, 'active']
    );

    if (existingSub.rows.length > 0) {
      return res.status(400).json({ error: { message: 'Already subscribed' } });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_CREATOR_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/creator/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/creator/subscription`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
        userType: 'creator',
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: { message: 'Failed to create subscription' } });
  }
});

// Get creator subscription status
router.get('/creator-subscription-status', authenticateToken, async (req, res) => {
  try {
    if (req.user.user_type !== 'creator') {
      return res.status(403).json({ error: { message: 'Creator access required' } });
    }

    const result = await pool.query(
      'SELECT * FROM creator_subscriptions WHERE creator_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.json({ subscribed: false, status: null });
    }

    const subscription = result.rows[0];
    res.json({
      subscribed: subscription.status === 'active',
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: { message: 'Failed to get subscription status' } });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;

        // Create subscription record
        await pool.query(
          `INSERT INTO creator_subscriptions 
           (creator_id, stripe_subscription_id, stripe_customer_id, status, current_period_end)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            session.subscription,
            session.customer,
            'active',
            new Date(session.current_period_end * 1000),
          ]
        );
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await pool.query(
          `UPDATE creator_subscriptions 
           SET status = $1, current_period_end = $2, cancel_at_period_end = $3
           WHERE stripe_subscription_id = $4`,
          [
            subscription.status,
            new Date(subscription.current_period_end * 1000),
            subscription.cancel_at_period_end,
            subscription.id,
          ]
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await pool.query(
          `UPDATE creator_subscriptions 
           SET status = $1
           WHERE stripe_subscription_id = $2`,
          ['canceled', subscription.id]
        );
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await pool.query(
          `UPDATE creator_subscriptions 
           SET status = $1
           WHERE stripe_customer_id = $2`,
          ['past_due', invoice.customer]
        );
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: { message: 'Webhook handler failed' } });
  }
});

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
