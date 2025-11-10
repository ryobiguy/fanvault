# FanVault - Keep 100% of Your Earnings

A revolutionary content subscription platform built with React, TypeScript, and Tailwind CSS. Unlike OnlyFans, FanVault charges creators a simple £10/month subscription fee and lets them keep 100% of their earnings. No commissions, no hidden fees.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 📱 Complete Feature List

### ✅ Implemented Pages

1. **Landing Page** (`/`) - Marketing homepage
2. **Login** (`/login`) - Authentication with demo accounts
3. **Signup** (`/signup`) - Account creation (Creator/Fan)
4. **Explore** (`/explore`) - Discover creators with search & filters
5. **Creator Dashboard** (`/creator/dashboard`) - Stats, content, earnings
6. **Fan Dashboard** (`/fan/dashboard`) - Content feed, subscriptions
7. **Messages** (`/messages`) - Free & paid messaging system
8. **Upload Content** (`/upload`) - Drag & drop content upload
9. **Edit Profile** (`/profile/edit`) - Profile & subscription tier management
10. **Settings** (`/settings`) - Account, privacy, notifications, billing, security
11. **Creator Profile** (`/creator/:username`) - Public creator pages

### 🎯 Key Features

#### For Creators:
- ✅ Upload photos, videos, text posts
- ✅ Set content as free or pay-per-view (PPV)
- ✅ Send free or paid messages to fans
- ✅ Manage 3 subscription tiers (Basic/Premium/VIP)
- ✅ Track earnings, subscribers, views
- ✅ Edit profile, bio, cover photo
- ✅ Keep 100% of earnings (only £10/month platform fee)

#### For Fans:
- ✅ Browse and search creators by category
- ✅ Subscribe to creators
- ✅ View content feed
- ✅ Message creators
- ✅ Purchase PPV content
- ✅ Manage subscriptions

#### Platform Features:
- ✅ Real-time search & filtering
- ✅ Category browsing (8 categories)
- ✅ Account switcher for testing
- ✅ Responsive design
- ✅ Beautiful UI with gradients & animations
- ✅ Settings management (privacy, notifications, billing, security)

## 🔑 Demo Accounts

**Creator Account:**
- Email: `creator` or `sarah@fanvault.com`
- Password: anything works!
- Access: Creator dashboard, upload content, messaging, profile editing

**Fan Account:**
- Email: `fan` or `john@example.com`
- Password: anything works!
- Access: Fan dashboard, explore creators, messaging, subscriptions

## Features

### For Creators
- **Keep 100% of Earnings** - Only pay £10/month, no commissions on your sales
- **Creator Dashboard** - Manage content, track earnings, and view analytics
- **Multiple Revenue Streams** - Subscriptions, pay-per-view content, paid messages, tips
- **Content Management** - Upload photos, videos, and posts
- **Direct Messaging** - Send free or paid content directly to fans
- **Analytics** - Track views, engagement, and earnings

### For Fans/Subscribers
- **Content Feed** - Browse latest content from subscribed creators
- **Creator Discovery** - Find and follow new creators
- **Subscription Tiers** - Choose from Basic, Premium, or VIP access
- **Direct Messaging** - Connect with favorite creators
- **Pay-Per-View Content** - Purchase individual content pieces
- **Personalized Experience** - Curated content recommendations

### Platform Features
- **Secure Authentication** - Email/password and social login options
- **Responsive Design** - Beautiful UI that works on all devices
- **Modern UI/UX** - Built with Tailwind CSS and Lucide icons
- **Fast Performance** - Optimized with Vite and React
- **Type Safety** - Full TypeScript support

## Business Model

**FanVault's Creator-First Approach:**
- Creators pay £10/month to access the platform
- Creators keep 100% of all earnings from fans
- No commissions on subscriptions, tips, or content sales
- Transparent, predictable pricing

**Revenue Streams for Creators:**
1. **Subscriptions** - Monthly recurring revenue from fans
2. **Pay-Per-View Content** - Sell individual photos/videos
3. **Paid Messages** - Monetize direct messages
4. **Tips** - Receive tips from fans
5. **Custom Requests** - Charge for personalized content

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd content-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
content-platform/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx       # Marketing homepage
│   │   ├── Login.tsx             # Login with demo accounts
│   │   ├── Signup.tsx            # Account creation
│   │   ├── Explore.tsx           # Creator discovery
│   │   ├── CreatorDashboard.tsx  # Creator dashboard
│   │   ├── FanDashboard.tsx      # Fan dashboard
│   │   ├── Messages.tsx          # Messaging system
│   │   ├── UploadContent.tsx     # Content upload
│   │   ├── EditProfile.tsx       # Profile editing
│   │   ├── SettingsPage.tsx      # Settings management
│   │   └── CreatorProfile.tsx    # Public creator profile
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication state
│   ├── components/
│   │   └── AccountSwitcher.tsx   # Demo account switcher
│   ├── App.tsx                   # Main app with routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── vite.config.ts              # Vite configuration
```

## 🗺️ All Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/login` | Login page | Public |
| `/signup` | Signup page | Public |
| `/explore` | Discover creators | Public/Logged in |
| `/creator/dashboard` | Creator dashboard | Creator only |
| `/fan/dashboard` | Fan dashboard | Fan only |
| `/messages` | Messaging system | Logged in |
| `/upload` | Upload content | Creator only |
| `/profile/edit` | Edit profile | Creator only |
| `/settings` | Account settings | Logged in |
| `/creator/:username` | Public creator profile | Public/Logged in |

## 🧪 Testing the Platform

### Test Flow for Creators:
1. Login as `creator`
2. View dashboard with stats (£12,450 earnings, 1,234 subscribers)
3. Click "Upload Content" → Upload photos/videos with pricing
4. Click "Edit Profile" → Update bio, subscription tiers
5. Click "Messages" → Send free or paid messages
6. Click "Settings" → Manage account, privacy, billing
7. Use Account Switcher (bottom right) to switch to Fan view

### Test Flow for Fans:
1. Login as `fan`
2. View content feed from creators
3. Click "Explore" → Browse creators by category
4. Search for creators
5. Click on creator card → View profile
6. Click "Messages" → Chat with creators
7. Click "Settings" → Manage preferences
8. Use Account Switcher to switch to Creator view

## 🔜 Next Steps for Production

### Backend Development Needed:
1. **Database** - PostgreSQL/MongoDB for users, content, transactions
2. **API** - Node.js/Express or Python/FastAPI
3. **Authentication** - JWT tokens, password hashing, OAuth
4. **File Storage** - AWS S3/Cloudinary for images/videos
5. **Payments** - Stripe integration for £10/month + fan payments
6. **Real-time** - WebSocket for messaging and notifications

### Additional Frontend Features:
1. **Analytics Dashboard** - Charts for earnings, views, engagement
2. **Comments & Likes** - Social features on posts
3. **Stories** - Instagram-style temporary content
4. **Live Streaming** - Real-time video streaming
5. **Referral Program** - Creator referral system
6. **Mobile App** - React Native version

### Business Requirements:
1. **Legal** - Terms of Service, Privacy Policy, DMCA
2. **Age Verification** - Required for adult content
3. **Content Moderation** - AI + human review
4. **Payment Processing** - Stripe account, merchant account
5. **Customer Support** - Help desk, ticketing system

## 📊 Current Status

**✅ Frontend Complete** - All UI/UX features built and functional  
**⏳ Backend Needed** - No data persistence yet  
**⏳ Payments Not Integrated** - Stripe integration pending  
**⏳ File Storage Not Connected** - Need cloud storage

The platform is fully functional as a **demo/prototype**!

## Key Features to Implement

This is a frontend prototype. To make it production-ready, you'll need to add:

1. **Backend API**
   - User authentication and authorization
   - Content storage and delivery
   - Payment processing (Stripe, PayPal)
   - Database (PostgreSQL, MongoDB)

2. **File Upload**
   - Image and video upload
   - Cloud storage (AWS S3, Cloudinary)
   - Content moderation

3. **Real-time Features**
   - Live messaging (WebSocket, Socket.io)
   - Notifications
   - Live streaming

4. **Payment Integration**
   - Subscription management
   - Payout processing
   - Transaction history

5. **Security**
   - JWT authentication
   - Rate limiting
   - Content encryption
   - HTTPS/SSL

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: { ... }
    }
  }
}
```

### Branding
- Update the logo and brand name in navigation components
- Modify the gradient colors in `tailwind.config.js`
- Change the favicon in `public/` directory

## License

This project is provided as-is for educational and development purposes.

## Support

For questions or issues, please open an issue in the repository.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
