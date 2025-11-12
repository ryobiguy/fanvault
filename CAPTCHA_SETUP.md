# Google reCAPTCHA Setup Guide

## Step 1: Get reCAPTCHA Keys

1. Go to https://www.google.com/recaptcha/admin/create
2. Register a new site:
   - **Label**: DirectFans
   - **reCAPTCHA type**: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - **Domains**: 
     - `localhost` (for development)
     - `fanvault.vercel.app` (your production domain)
   - Accept terms and submit

3. You'll get two keys:
   - **Site Key** (public) - Use in frontend
   - **Secret Key** (private) - Use in backend

## Step 2: Add to Environment Variables

### Vercel (Frontend):
```
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

### Railway (Backend):
```
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## Step 3: Install Package

Run in your project:
```bash
npm install react-google-recaptcha
npm install --save-dev @types/react-google-recaptcha
```

## Step 4: Test

- Development: Works on localhost
- Production: Works on fanvault.vercel.app

## Notes:
- reCAPTCHA v2 is easier to implement than v3
- Free tier: Unlimited requests
- Protects against bots and automated signups
