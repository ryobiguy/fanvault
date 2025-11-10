# FanVault Backend API

Node.js/Express backend for FanVault content subscription platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up PostgreSQL database:**
```bash
# Create database
createdb fanvault

# Run schema
psql -d fanvault -f src/database/schema.sql
```

3. **Configure environment:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# - Database credentials
# - JWT secret
# - Stripe keys (optional for now)
# - Cloudinary credentials (optional for now)
```

4. **Start server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user (creator/fan)
- `POST /login` - Login user
- `GET /me` - Get current user info

### Users (`/api/users`)
- `GET /profile/:username` - Get user profile
- `PUT /profile` - Update own profile
- `PUT /subscription-tiers` - Update subscription tiers (creator)
- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings
- `GET /search` - Search creators

### Content (`/api/content`)
- `POST /` - Create content post (creator)
- `GET /feed` - Get content feed (subscribed creators)
- `GET /creator/:creatorId` - Get creator's content
- `GET /:contentId` - Get single content post
- `POST /:contentId/like` - Like/unlike content
- `DELETE /:contentId` - Delete content (creator)

### Messages (`/api/messages`)
- `POST /` - Send message (free or paid)
- `GET /conversations` - Get all conversations
- `GET /thread/:userId` - Get messages with specific user
- `PUT /:messageId/read` - Mark message as read
- `DELETE /:messageId` - Delete message

### Subscriptions (`/api/subscriptions`)
- `POST /subscribe` - Subscribe to creator
- `POST /unsubscribe/:creatorId` - Unsubscribe from creator
- `GET /my-subscriptions` - Get user's subscriptions
- `GET /my-subscribers` - Get creator's subscribers
- `GET /status/:creatorId` - Check subscription status

### Payments (`/api/payments`)
- `POST /purchase-content` - Purchase PPV content
- `POST /purchase-message` - Purchase paid message
- `GET /earnings` - Get creator earnings
- `GET /transactions` - Get transaction history

## 🗄️ Database Schema

### Main Tables:
- **users** - User accounts (email, password, type)
- **profiles** - User profiles (name, username, bio, avatar)
- **creator_subscriptions** - £10/month platform fee subscriptions
- **subscription_tiers** - Creator's subscription tiers (Basic/Premium/VIP)
- **fan_subscriptions** - Fan subscriptions to creators
- **content_posts** - Content posts (images, videos, text)
- **content_purchases** - PPV content purchases
- **messages** - Direct messages (free/paid)
- **message_purchases** - Paid message purchases
- **transactions** - All payment transactions
- **user_settings** - User preferences

## 🔐 Authentication

Uses JWT (JSON Web Tokens) for authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Token expires in:** 7 days (configurable)

## 💰 Payment Flow

### Creator Platform Fee (£10/month)
1. Creator registers
2. Stripe subscription created for £10/month
3. Subscription status tracked in `creator_subscriptions`
4. Creators can only post content with active subscription

### Fan Subscriptions (100% to Creator)
1. Fan subscribes to creator's tier
2. Payment goes directly to creator (via Stripe Connect)
3. Platform takes NO commission
4. Subscription tracked in `fan_subscriptions`

### PPV Content
1. Creator posts paid content
2. Fan purchases content
3. 100% of payment goes to creator
4. Purchase tracked in `content_purchases`

### Paid Messages
1. Creator sends paid message
2. Fan unlocks by paying
3. 100% of payment goes to creator
4. Purchase tracked in `message_purchases`

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fanvault
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Stripe (for production)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CREATOR_PRICE_ID=price_...

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📝 API Response Format

### Success Response:
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response:
```json
{
  "error": {
    "message": "Error message"
  }
}
```

### Validation Errors:
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

## 🚧 TODO for Production

### Required:
- [ ] Implement Stripe payment processing
- [ ] Add Cloudinary file upload integration
- [ ] Implement WebSocket for real-time messaging
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add rate limiting per user
- [ ] Implement content moderation
- [ ] Add database migrations system
- [ ] Set up proper logging
- [ ] Add API documentation (Swagger)

### Security:
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] Implement SQL injection prevention (using parameterized queries)
- [ ] Add XSS protection
- [ ] Implement proper session management
- [ ] Add 2FA support
- [ ] Implement account lockout after failed attempts

### Performance:
- [ ] Add Redis caching
- [ ] Implement database connection pooling (already configured)
- [ ] Add CDN for static assets
- [ ] Optimize database queries with indexes
- [ ] Implement pagination for all list endpoints

## 🧪 Testing

Currently no tests implemented. Recommended:
- Jest for unit tests
- Supertest for API integration tests
- Database seeding for test data

## 📊 Database Indexes

Already implemented for performance:
- User email, type
- Profile username
- Content creator_id, created_at
- Messages sender/recipient
- Subscriptions fan/creator
- Transactions user_id

## 🔄 Current Status

**✅ Implemented:**
- Complete REST API structure
- Authentication with JWT
- User registration and login
- Profile management
- Content CRUD operations
- Messaging system (free/paid)
- Subscription management
- Payment tracking (demo mode)
- Transaction history
- Search functionality

**⏳ Not Implemented:**
- Stripe payment processing (demo mode only)
- File upload to Cloudinary (URLs only)
- Real-time WebSocket messaging
- Email notifications
- Push notifications

## 🤝 Integration with Frontend

Frontend should make requests to `http://localhost:5000/api/`

**Example:**
```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Authenticated request
const response = await fetch('http://localhost:5000/api/content/feed', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📞 Support

For issues or questions, check the main project README.
