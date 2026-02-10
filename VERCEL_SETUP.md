# 🚀 Vercel Deployment - Quick Guide

## ⚡ Fast Deploy (5 minutes)

### Step 1: Go to Vercel
👉 **Click here:** https://vercel.com/new

### Step 2: Import Repository
1. Click **"Import Git Repository"**
2. Select: **RefaelYHarush/y-community-command-center**
3. Click **"Import"**

### Step 3: Configure Project
- **Framework Preset:** Next.js (auto-detected ✅)
- **Root Directory:** `./`
- **Build Command:** `npm run build` (auto ✅)
- **Output Directory:** `.next` (auto ✅)

### Step 4: Add Environment Variables

**Click "Environment Variables" and add these:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://yjonbtiqsteccjlvppoy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb25idGlxc3RlY2NqbHZwcG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMjEzMDYsImV4cCI6MjA1MDY5NzMwNn0.HxJVlIxW-rOHe_2Q6RNiA9TVLNuqG1L0YnWWuwwQyvE
SUPABASE_SERVICE_KEY=<YOUR_SERVICE_ROLE_KEY_HERE>
TELEGRAM_BOT_TOKEN=8255672486:AAHRZisWcRQRMznF9fW8RwO9Z1hfYTaEgdI
TELEGRAM_ADMIN_IDS=<YOUR_TELEGRAM_USER_ID>
AGENT_RUNTIME_URL=https://superb-surprise-production.up.railway.app
```

**⚠️ Important:**
- Get your `SUPABASE_SERVICE_KEY` from: Supabase Dashboard → Settings → API → service_role key
- Get your Telegram User ID: Send `/start` to @userinfobot in Telegram
- Set `NEXT_PUBLIC_APP_URL` after deployment (Step 6)

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait ~2 minutes
3. ✅ Done!

### Step 6: Configure Telegram Webhook

**After deployment, you'll get a URL like:**
`https://y-community-command-center.vercel.app`

**Set the webhook:**
```bash
curl -X POST "https://api.telegram.org/bot8255672486:AAHRZis.../setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://y-community-command-center.vercel.app/api/webhook/telegram"}'
```

**Verify webhook:**
```bash
curl "https://api.telegram.org/bot8255672486:AAHRZis.../getWebhookInfo"
```

**Add NEXT_PUBLIC_APP_URL to Vercel:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_APP_URL=https://y-community-command-center.vercel.app`
3. Redeploy: Deployments → ⋯ → Redeploy

---

## ✅ Test Your Deployment

### 1. Test Dashboard
Open: https://your-app.vercel.app
- Should see stats loading
- Charts displaying
- Agents table
- RTL Hebrew text

### 2. Test API
```bash
curl https://your-app.vercel.app/api/stats
curl https://your-app.vercel.app/api/agents
```

### 3. Test Telegram Bot
Send to your bot:
- `/start`
- `/status`
- `/agents`
- `/runs`
- `/alerts`

---

## 🐛 Troubleshooting

### Dashboard shows "טוען נתונים..." forever
- Check Vercel logs: Deployments → View Function Logs
- Verify Supabase credentials are correct
- Ensure database tables exist: `agents`, `agent_runs`, `agent_alerts`

### Telegram bot not responding
- Verify webhook is set: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Check Vercel function logs
- Ensure `TELEGRAM_BOT_TOKEN` is correct

### "Unauthorized" errors
- Check `SUPABASE_SERVICE_KEY` is the service_role key, not anon key
- Verify admin ID in `TELEGRAM_ADMIN_IDS`

---

## 📊 Database Tables Required

Make sure these tables exist in Supabase:

### `agents` table:
```sql
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  autonomous BOOLEAN DEFAULT FALSE,
  last_run TIMESTAMP,
  next_run TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `agent_runs` table:
```sql
CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT REFERENCES agents(id),
  status TEXT NOT NULL,
  result JSONB,
  error TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `agent_alerts` table:
```sql
CREATE TABLE agent_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT REFERENCES agents(id),
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎉 Success!

Your Command Center is now live! 🚀

**Next steps:**
1. Bookmark your Vercel URL
2. Pin your Telegram bot
3. Monitor agents from the dashboard

---

**Need help?** Check the logs in Vercel or contact refael00111@gmail.com
