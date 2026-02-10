#!/bin/bash

# 🚀 Y-Community Command Center - Quick Deploy Script

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Y-Community Command Center - Deployment${NC}\n"

# Step 1: Verify build
echo -e "${BLUE}Step 1: Building project...${NC}"
npm run build
echo -e "${GREEN}✅ Build successful!${NC}\n"

# Step 2: Git check
echo -e "${BLUE}Step 2: Checking git status...${NC}"
if [ -d ".git" ]; then
  echo -e "${GREEN}✅ Git repository exists${NC}"
else
  echo -e "${YELLOW}⚠️  No git repository found. Initialize? (y/n)${NC}"
  read -r response
  if [[ "$response" == "y" ]]; then
    git init
    git add .
    git commit -m "feat: Initial Command Center v1.0.0"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
  fi
fi
echo ""

# Step 3: Vercel deployment
echo -e "${BLUE}Step 3: Deploying to Vercel...${NC}"
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
  npm i -g vercel
fi

echo -e "${YELLOW}Deploying to production...${NC}"
vercel --prod

echo -e "${GREEN}✅ Deployment complete!${NC}\n"

# Step 4: Telegram webhook setup
echo -e "${BLUE}Step 4: Configure Telegram webhook${NC}"
echo -e "${YELLOW}Enter your Vercel URL (e.g., https://your-app.vercel.app):${NC}"
read -r VERCEL_URL

if [ -n "$VERCEL_URL" ]; then
  # Get bot token from .env.local
  if [ -f ".env.local" ]; then
    BOT_TOKEN=$(grep TELEGRAM_BOT_TOKEN .env.local | cut -d '=' -f2)

    if [ -n "$BOT_TOKEN" ]; then
      echo -e "${YELLOW}Setting webhook...${NC}"
      curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
        -H "Content-Type: application/json" \
        -d "{\"url\": \"${VERCEL_URL}/api/webhook/telegram\"}"

      echo -e "\n${GREEN}✅ Webhook configured!${NC}\n"

      echo -e "${BLUE}Verifying webhook...${NC}"
      curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"
      echo ""
    else
      echo -e "${RED}❌ TELEGRAM_BOT_TOKEN not found in .env.local${NC}"
    fi
  else
    echo -e "${RED}❌ .env.local not found${NC}"
  fi
else
  echo -e "${YELLOW}⏭️  Skipping webhook setup${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Open ${VERCEL_URL}"
echo -e "2. Test Telegram bot with /start"
echo -e "3. Verify dashboard loads"
echo ""
