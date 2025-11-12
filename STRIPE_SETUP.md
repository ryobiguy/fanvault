# Stripe Setup Guide for DirectFans

## Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Start now" and create an account
3. Complete the registration

## Step 2: Get API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`) - Use in frontend
   - **Secret key** (starts with `sk_test_`) - Use in backend

## Step 3: Create Product & Price

1. Go to https://dashboard.stripe.com/test/products
2. Click "+ Add product"
3. Fill in:
   - **Name**: DirectFans Creator Subscription
   - **Description**: Monthly subscription for creators - Keep 100% of your earnings
   - **Pricing**: 
     - Model: Recurring
     - Price: £10.00 GBP
     - Billing period: Monthly
4. Click "Save product"
5. **Copy the Price ID** (starts with `price_`) - you'll need this!

## Step 4: Set Up Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "+ Add endpoint"
3. Endpoint URL: `https://fanvault-production.up.railway.app/api/payments/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. **Copy the Webhook signing secret** (starts with `whsec_`)

## Step 5: Add to Environment Variables

### Railway (Backend):
```
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_CREATOR_PRICE_ID=price_your_price_id_here
```

### Vercel (Frontend):
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## Step 6: Test Mode

- All these keys are **TEST MODE** keys
- Use test card: 4242 4242 4242 4242 (any future date, any CVC)
- When ready for production, switch to live keys

## Pricing:
- Stripe fee: 1.5% + 20p per transaction
- £10 subscription = £9.63 after Stripe fees
- You keep: £9.63 per creator per month

## Notes:
- Subscriptions auto-renew monthly
- Customers can cancel anytime
- Failed payments trigger webhooks
- 3-day grace period before cancellation
