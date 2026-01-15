# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for Listen Buddy subscriptions.

## Prerequisites

1. **Stripe Account**: Create a free Stripe account at [stripe.com](https://stripe.com)
2. **Products**: Create 4 products/prices in Stripe Dashboard for your plans
3. **Webhook**: Set up a webhook endpoint in Stripe

## Step 1: Create Stripe Products & Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Click "Add product" for each plan:

### Free Plan
- Name: Listen Buddy - Free
- Description: 5 minutes of audio analysis, Plugin chat (limited)
- Price: $0.00

### Basic Plan
- Name: Listen Buddy - Basic
- Description: 30 minutes/month, Plugin chat (unlimited)
- Monthly Price: $7.99/month
- Yearly Price: $85/year (save $10.88)
- Recurring: Monthly or Yearly

### Pro Plan
- Name: Listen Buddy - Pro
- Description: 120 minutes/month, Plugin chat (unlimited)
- Monthly Price: $29.99/month
- Yearly Price: $320/year (save $39.88)
- Recurring: Monthly or Yearly

### Max Plan
- Name: Listen Buddy - Max
- Description: 350 minutes/month, Plugin chat (unlimited)
- Monthly Price: $69.99/month
- Yearly Price: $830/year (save $9.88)
- Recurring: Monthly or Yearly

### Top-up Packs (One-time purchases)

#### Small Top-up
- Name: Listen Buddy - Small Top-up
- Description: 20 extra analysis minutes
- Price: $4.99 (one-time)
- Effective rate: $0.250/min

#### Medium Top-up
- Name: Listen Buddy - Medium Top-up
- Description: 45 extra analysis minutes
- Price: $9.99 (one-time)
- Effective rate: $0.222/min (Best value)

#### Large Top-up
- Name: Listen Buddy - Large Top-up
- Description: 80 extra analysis minutes
- Price: $19.99 (one-time)
- Effective rate: $0.250/min

## Step 2: Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy these keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)
   - **Webhook signing secret** (create webhook first, then get secret)

## Step 3: Configure Environment Variables

Update your `.env.local` file with your Stripe credentials:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

# Monthly Prices
STRIPE_PRICE_BASIC_MONTHLY=price_your_basic_monthly_price_id
STRIPE_PRICE_PRO_MONTHLY=price_your_pro_monthly_price_id
STRIPE_PRICE_MAX_MONTHLY=price_your_max_monthly_price_id

# Yearly Prices
STRIPE_PRICE_BASIC_YEARLY=price_your_basic_yearly_price_id
STRIPE_PRICE_PRO_YEARLY=price_your_pro_yearly_price_id
STRIPE_PRICE_MAX_YEARLY=price_your_max_yearly_price_id

# Top-up Packs (one-time)
STRIPE_PRICE_TOPUP_SMALL=price_your_small_topup_price_id
STRIPE_PRICE_TOPUP_MEDIUM=price_your_medium_topup_price_id
STRIPE_PRICE_TOPUP_LARGE=price_your_large_topup_price_id
```

**Important:**
- Replace the placeholder values with your actual Stripe keys
- Keep these values secret - never commit `.env.local` to git
- For production, use live keys (sk_live_...) instead of test keys

## Step 4: Set Up Webhook

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter: `https://your-domain.com/api/stripe-webhook`
   - For local development: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) or ngrok
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret
6. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Local Development with Stripe CLI

```bash
# Install Stripe CLI
npm install -g stripe

# Login to Stripe
stripe login

# Forward webhook to localhost
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

### Local Development with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok
ngrok http 3000

# Use the ngrok URL for webhook
# e.g., https://abc123.ngrok.io/api/stripe-webhook
```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to Listen Buddy page: `http://localhost:3000/products/listen-buddy#pricing`

3. Click "Choose Plan" on any paid plan

4. You should be redirected to `/checkout?plan=pro`

5. Click "Proceed to Checkout"

6. Complete the Stripe test payment (use test card: 4242 4242 4242 4242)

7. After payment, you'll be redirected to `/checkout/success`

## How It Works

### Flow Diagram

```
User clicks "Choose Plan"
  ↓
Navigate to /checkout?plan=pro
  ↓
User reviews order and clicks "Proceed to Checkout"
  ↓
POST /api/checkout
  ↓
Stripe creates checkout session
  ↓
Redirect to Stripe Checkout
  ↓
User completes payment
  ↓
Stripe sends webhook event
  ↓
POST /api/stripe-webhook
  ↓
Update user profile in Supabase
  ↓
Redirect to /checkout/success
```

### API Routes

- **`POST /api/checkout`**: Creates Stripe checkout session
- **`POST /api/stripe-webhook`**: Handles Stripe webhook events

### Database Updates

The webhook updates the user's profile in Supabase:
- `subscription_plan`: The plan ID (free, basic, pro, max)
- `subscription_period`: The billing period (monthly, yearly)
- `subscription_status`: active, cancelled, or past_due
- `stripe_customer_id`: Customer ID from Stripe
- `stripe_subscription_id`: Subscription ID from Stripe

## Troubleshooting

### Webhook Not Receiving Events

1. Check if webhook URL is accessible
2. Verify Stripe CLI or ngrok is running
3. Check Stripe Dashboard webhook logs for errors
4. Ensure webhook secret matches

### Checkout Fails

1. Check console for error messages
2. Verify Stripe keys are correct in `.env.local`
3. Ensure price IDs match your Stripe products
4. Check Stripe Dashboard for failed payments

### Payment Not Updating Profile

1. Check webhook logs in terminal
2. Verify Supabase connection
3. Check if user email matches Stripe customer email
4. Ensure `stripe_customer_id` and `stripe_subscription_id` fields exist in profiles table

## Production Checklist

Before going live:

- [ ] Switch from test keys to live keys
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production URL
- [ ] Update webhook URL to production endpoint
- [ ] Test with real payment method
- [ ] Verify subscription management works
- [ ] Set up cancellation flow

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Verify webhook signatures on your server
- Use HTTPS in production
- Implement proper error handling for failed payments

## Support

For issues:
- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Supabase Docs: https://supabase.com/docs
