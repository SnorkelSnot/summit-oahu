# Summit O'ahu — Setup & Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy the env file and fill in your keys
cp .env.local.example .env.local

# 3. Run the dev server
npm run dev
```

Visit http://localhost:3000

---

## Deploying to Netlify (since you're already using it for SnorkelSnot)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Summit O'ahu website"
git remote add origin https://github.com/YOUR_USERNAME/summit-oahu.git
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Log into https://app.netlify.com (same account as SnorkelSnot)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Netlify auto-detects Next.js. Build settings should be:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"
6. Go to Site settings → Domain management → Add `summitoahu.com`

### Step 3: Set Up Upstash Redis (for booking calendar data)
Since we need a KV store for availability data, use Upstash (free tier):
1. Go to https://upstash.com and create a free account
2. Create a new Redis database (choose the region closest to you)
3. Copy the connection credentials
4. In `src/lib/availability.ts`, swap `@vercel/kv` for `@upstash/redis`:
   ```
   npm install @upstash/redis
   ```
   Then update the import:
   ```ts
   import { Redis } from '@upstash/redis'
   const kv = new Redis({
     url: process.env.KV_REST_API_URL!,
     token: process.env.KV_REST_API_TOKEN!,
   })
   ```
   (The `.get()` and `.set()` methods are the same, so no other changes needed!)

### Step 4: Configure Stripe
1. Log into https://dashboard.stripe.com
2. Create a new account for Summit O'ahu (or use existing)
3. Get your API keys from Developers → API keys:
   - `STRIPE_SECRET_KEY` (starts with `sk_live_` or `sk_test_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_` or `pk_test_`)
4. Set up the webhook:
   - Go to Developers → Webhooks → Add endpoint
   - URL: `https://summitoahu.com/api/webhook`
   - Events: Select `checkout.session.completed`
   - Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Step 5: Add Environment Variables
In Netlify dashboard → Site settings → Environment variables, add:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL` = `https://summitoahu.com`
- `KV_REST_API_URL` (from Upstash)
- `KV_REST_API_TOKEN` (from Upstash)

### Step 6: Point Your Domain
In your domain registrar (GoDaddy, Namecheap, etc.):
- Add CNAME record pointing to your Netlify site URL
- Or use Netlify DNS (same as you did for SnorkelSnot)

---

## Project Structure

```
summit-oahu/
├── public/images/          # Tour photos & logo concepts
├── src/
│   ├── app/
│   │   ├── page.tsx        # Homepage
│   │   ├── book/           # Booking page
│   │   ├── thank-you/      # Post-payment thank you page
│   │   ├── admin/          # Admin dashboard (manage availability)
│   │   └── api/
│   │       ├── availability/   # Calendar data endpoint
│   │       ├── create-checkout/ # Stripe checkout session
│   │       └── webhook/        # Stripe payment webhook
│   ├── components/         # UI components
│   └── lib/
│       ├── hotels.ts       # Hotel dropdown data
│       ├── stripe.ts       # Stripe config & pricing
│       └── availability.ts # Booking availability logic
```

---

## Admin Dashboard

Visit `/admin` to manage your calendar. The default password is `summit2024` — **change this immediately** in production or replace with proper auth (Vercel Auth, NextAuth, etc.)

From the admin you can:
- View bookings for any day
- See private tour status and van seat counts
- Block days for events or days off

---

## Pricing Reference

| Tour Type        | Vehicle  | Price   |
|------------------|----------|---------|
| Private (1-4)    | Mercedes | $1,040  |
| Private (1-13)   | Van      | $1,800  |
| Semi-Private     | Van      | $139/pp |
| Custom           | Mercedes | $1,400  |
| Custom           | Van      | $2,200  |

---

## Email Setup (Optional)

To send booking confirmations, configure SMTP in .env.local.
Gmail app passwords work well for this — or use services like Resend, SendGrid, or Mailgun.

---

## Need Help?

This project was built with Next.js 14, Tailwind CSS, Stripe, and Upstash Redis.
Deployed on Netlify. For issues, the Next.js docs (https://nextjs.org/docs),
Netlify docs (https://docs.netlify.com/frameworks/next-js/overview/),
and Stripe docs (https://stripe.com/docs) are great resources.
