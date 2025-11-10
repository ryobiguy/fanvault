import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Seeding database...');

    // Create demo creator
    const creatorPassword = await bcrypt.hash('password123', 10);
    const creatorResult = await client.query(
      `INSERT INTO users (email, password_hash, user_type, is_verified, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['sarah@fanvault.com', creatorPassword, 'creator', true, true]
    );
    const creatorId = creatorResult.rows[0].id;

    await client.query(
      `INSERT INTO profiles (user_id, display_name, username, bio)
       VALUES ($1, $2, $3, $4)`,
      [creatorId, 'Sarah Johnson', 'sarahjfit', 'Fitness coach & lifestyle creator 💪 Helping you achieve your fitness goals']
    );

    await client.query(
      'INSERT INTO user_settings (user_id) VALUES ($1)',
      [creatorId]
    );

    // Create subscription tiers for creator
    await client.query(
      `INSERT INTO subscription_tiers (creator_id, tier_name, tier_level, price, description)
       VALUES 
       ($1, 'Basic', 1, 9.99, 'Access to all my content'),
       ($1, 'Premium', 2, 19.99, 'Everything in Basic + exclusive content'),
       ($1, 'VIP', 3, 49.99, 'Everything + 1-on-1 messaging')`,
      [creatorId]
    );

    // Create active creator subscription
    await client.query(
      `INSERT INTO creator_subscriptions (creator_id, status, current_period_start, current_period_end)
       VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month')`,
      [creatorId, 'active']
    );

    // Create demo fan
    const fanPassword = await bcrypt.hash('password123', 10);
    const fanResult = await client.query(
      `INSERT INTO users (email, password_hash, user_type, is_verified, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['john@example.com', fanPassword, 'fan', true, true]
    );
    const fanId = fanResult.rows[0].id;

    await client.query(
      `INSERT INTO profiles (user_id, display_name, username, bio)
       VALUES ($1, $2, $3, $4)`,
      [fanId, 'John Smith', 'johnsmith', 'Content enthusiast']
    );

    await client.query(
      'INSERT INTO user_settings (user_id) VALUES ($1)',
      [fanId]
    );

    // Create some demo content
    await client.query(
      `INSERT INTO content_posts (creator_id, content_type, caption, is_paid, price, is_published)
       VALUES 
       ($1, 'image', 'Morning workout routine! 💪', false, null, true),
       ($1, 'video', 'Full body workout - 30 minutes', false, null, true),
       ($1, 'image', 'Exclusive training program 🔥', true, 10.00, true)`,
      [creatorId]
    );

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Demo Accounts:');
    console.log('Creator: sarah@fanvault.com / password123');
    console.log('Fan: john@example.com / password123');

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
