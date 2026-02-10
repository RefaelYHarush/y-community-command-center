# 🎛️ Y-Community Command Center

> Production-ready dashboard and Telegram bot for managing Y-Community agent infrastructure

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![Telegraf](https://img.shields.io/badge/Telegraf-Bot-blue)](https://telegraf.js.org/)

---

## 🚀 Features

### 📊 Real-time Dashboard
- **Live statistics** - Total agents, active agents, success rate, alerts
- **Interactive charts** - 7-day run history with success/failure breakdown
- **Agent monitoring** - Status, last run time, autonomous/manual indicator
- **Run timeline** - Latest 20 agent executions with duration
- **Alert management** - Acknowledge and dismiss active alerts
- **Auto-refresh** - Updates every 30 seconds

### 📱 Telegram Bot
- **/status** - System overview (agents, runs, success rate)
- **/agents** - List all agents with status
- **/runs** - Last 10 agent executions
- **/alerts** - Active alerts requiring attention
- **/run <agent_id>** - Manually trigger agent (admin only)
- **/clear_alerts** - Acknowledge all alerts (admin only)
- **/help** - Full command reference

---

## 🛠️ Quick Start

```bash
cd ~/projects/y-community-command-center
npm install
npm run dev
```

Open http://localhost:3000

---

## 📊 Dashboard Screenshots

*Coming soon*

---

## 🚀 Deploy to Vercel

See full deployment guide in the project.

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Created:** 2026-02-10
