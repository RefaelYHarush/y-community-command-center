# 🚀 Command Center - Deployment Guide

## Pre-Deployment Checklist

- [ ] Supabase database has required tables (`agents`, `agent_runs`, `agent_alerts`)
- [ ] Telegram bot token obtained from @BotFather
- [ ] Admin user IDs identified
- [ ] Agent Runtime deployed on Railway
- [ ] GitHub repository created

---

## Step 1: Prepare Repository

```bash
cd ~/projects/y-community-command-center

# Initialize git
git init
git add .
git commit -m "feat: Initial Command Center v1.0.0"

# Create GitHub repo (via gh CLI or web)
gh repo create y-community-command-center --public --source=. --remote=origin

# Push
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import Git Repository → Select `y-community-command-center`
3. Configure Project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. **Add Environment Variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://yjonbtiqsteccjlvppoy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-role-key>
TELEGRAM_BOT_TOKEN=8255672486:AAHRZis...
TELEGRAM_ADMIN_IDS=123456789
AGENT_RUNTIME_URL=https://superb-surprise-production.up.railway.app
NEXT_PUBLIC_APP_URL=https://y-community-command-center.vercel.app
```

5. Click **Deploy**

---

## Step 3: Configure Telegram Webhook

After deployment completes, get your Vercel URL and set the webhook:

```bash
# Get your Vercel URL (e.g., https://y-community-command-center.vercel.app)
VERCEL_URL="https://y-community-command-center.vercel.app"
BOT_TOKEN="8255672486:AAHRZis..."

# Set webhook
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${VERCEL_URL}/api/webhook/telegram\"}"
```

**Expected Response:**
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

**Verify webhook:**
```bash
curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"
```

---

## Step 4: Test Deployment

### Dashboard
1. Open your Vercel URL
2. Verify all stats load
3. Check charts display
4. Ensure agents table populates

### Telegram Bot
1. Open Telegram
2. Search for your bot
3. Send `/start`
4. Test commands: `/status`, `/agents`, `/runs`, `/alerts`

### API Endpoints
```bash
# Stats
curl https://your-app.vercel.app/api/stats

# Agents
curl https://your-app.vercel.app/api/agents

# Runs
curl https://your-app.vercel.app/api/runs?limit=10
```

---

## Step 5: Monitor

### Vercel Dashboard
- Check deployment logs
- Monitor function invocations
- Review error logs

### Telegram
- Send `/ping` to check bot latency
- Verify all commands work

---

## Troubleshooting

### Dashboard shows "טוען נתונים..." forever
- Check Vercel logs for API errors
- Verify Supabase credentials
- Ensure database tables exist

### Telegram bot doesn't respond
- Check webhook status: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Review Vercel function logs
- Verify bot token is correct
- Ensure webhook URL is HTTPS

### "Error fetching stats/agents/runs"
- Check Supabase service role key
- Verify RLS policies allow service role access
- Check network connectivity

---

## Production Optimizations

### 1. Enable Caching
Add to `next.config.ts`:
```typescript
const nextConfig = {
  // ... existing config
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};
```

### 2. Add Monitoring
Install Vercel Analytics:
```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Set up Alerts
- Vercel → Project Settings → Notifications
- Enable deployment notifications
- Add webhook for Slack/Discord

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon key (public) |
| `SUPABASE_SERVICE_KEY` | ✅ Yes | Supabase service role key (server-only) |
| `TELEGRAM_BOT_TOKEN` | ✅ Yes | Bot token from @BotFather |
| `TELEGRAM_ADMIN_IDS` | ✅ Yes | Comma-separated admin user IDs |
| `AGENT_RUNTIME_URL` | ✅ Yes | Railway agent runtime URL |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Optional | Your Vercel URL (for webhooks) |
| `TELEGRAM_WEBHOOK_SECRET` | ⚠️ Optional | Webhook signature validation |
| `ANTHROPIC_API_KEY` | ⚠️ Optional | If using Claude features |

---

## Post-Deployment

1. ✅ Dashboard accessible
2. ✅ Telegram bot responding
3. ✅ All API endpoints working
4. ✅ Charts displaying data
5. ✅ Alerts system functional
6. ✅ Admin commands working

---

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Test Telegram webhook with `getWebhookInfo`
4. Contact: refael00111@gmail.com

---

**Deployment Time:** ~10 minutes
**Status:** ✅ Production Ready
**Last Updated:** 2026-02-10
