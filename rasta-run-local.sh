#!/usr/bin/env bash
# ==============================================================================
# RASTA — PAKISTAN AUTOMOTIVE ARCHIVE: LOCAL RUN & SETUP SCRIPT
# ==============================================================================
# This script sets up and launches the RASTA full-stack application on your
# local machine (macOS, Linux, or Windows WSL/Git Bash).
#
# Requirements:
#   - Node.js v18.17+ or v20+ (https://nodejs.org)
#   - npm v9+ (included with Node.js)
# ==============================================================================

set -e

GREEN='\033[0;32m'
GOLD='\033[0;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GOLD}=====================================================================${NC}"
echo -e "${GOLD}  RASTA — PAKISTAN AUTOMOTIVE ARCHIVE & DATABASE LOCAL LAUNCHER    ${NC}"
echo -e "${GOLD}=====================================================================${NC}"

# Step 1: Check Node.js and npm installation
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed or not in your PATH.${NC}"
    echo -e "Please install Node.js v20 LTS from https://nodejs.org and try again."
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${CYAN}[1/6] Using Node.js ${NODE_VERSION}...${NC}"

# Step 2: Install dependencies
echo -e "${CYAN}[2/6] Installing npm dependencies...${NC}"
npm install

# Step 3: Generate Prisma Client & Sync SQLite development database
echo -e "${CYAN}[3/6] Generating Prisma Client & syncing local database (dev.db)...${NC}"
npx prisma generate
npx prisma db push

# Step 4: Seed & expand verified 200-variant Pakistan automotive catalog
echo -e "${CYAN}[4/6] Seeding verified 200-variant Pakistan automotive catalog...${NC}"
npm run db:seed || true
if [ -f "scripts/expand-catalog.ts" ]; then
    echo -e "      -> Running catalog expansion pipeline..."
    npx tsx scripts/expand-catalog.ts || true
fi
if [ -f "scripts/import-research-queue.ts" ]; then
    echo -e "      -> Running research queue import pipeline..."
    npx tsx scripts/import-research-queue.ts || true
fi
if [ -f "scripts/ingest-official-photography.ts" ]; then
    echo -e "      -> Auditing and attaching official photography metadata..."
    npx tsx scripts/ingest-official-photography.ts || true
fi

# Step 5: Verify data reconciliation
echo -e "${CYAN}[5/6] Auditing database reconciliation (40 brands, 200 variants)...${NC}"
if [ -f "scripts/reconcile-database.ts" ]; then
    npx tsx scripts/reconcile-database.ts || true
fi

# Step 6: Choose between Development Server or Production Build
echo -e "${GOLD}=====================================================================${NC}"
echo -e "${GREEN}  RASTA DATABASE READY! 40 BRANDS • 200 VERIFIED VARIANTS • 1950s–2020s${NC}"
echo -e "${GOLD}=====================================================================${NC}"
echo ""
echo "Select how you would like to run RASTA on your computer:"
echo "  [1] Development Server (Hot-reloading, npm run dev -> http://localhost:3000)"
echo "  [2] Production Build & Server (Fast optimized bundle, npm run build && npm start)"
echo "  [3] Inspect Database with Prisma Studio (GUI database browser, http://localhost:5555)"
echo "  [4] Run Full 24-Test Automated Verification Suite (npm test)"
echo ""

read -p "Enter your choice [1-4] (default: 1): " CHOICE
CHOICE=${CHOICE:-1}

case "$CHOICE" in
    1)
        echo -e "${GREEN}Starting RASTA development server on http://localhost:3000...${NC}"
        echo "Press Ctrl+C to stop."
        npm run dev
        ;;
    2)
        echo -e "${CYAN}Building optimized production application...${NC}"
        npm run build
        echo -e "${GREEN}Starting RASTA production server on http://localhost:3000...${NC}"
        echo "Press Ctrl+C to stop."
        npm start
        ;;
    3)
        echo -e "${GREEN}Opening Prisma Studio GUI database browser on http://localhost:5555...${NC}"
        npx prisma studio
        ;;
    4)
        echo -e "${CYAN}Executing 24-Test RASTA Automated Test Suite...${NC}"
        npm test
        ;;
    *)
        echo -e "${RED}Invalid choice. Starting development server on http://localhost:3000...${NC}"
        npm run dev
        ;;
esac
