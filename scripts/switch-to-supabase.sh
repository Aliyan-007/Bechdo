#!/usr/bin/env bash
# ==============================================================================
# RASTA — SWITCH DATABASE ENGINE TO SUPABASE (MANAGED POSTGRESQL)
# ==============================================================================
# This script configures RASTA to use Supabase PostgreSQL as its production
# database, deploys the 18-model schema, and seeds all 200 verified variants.
# ==============================================================================

set -e

GREEN='\033[0;32m'
GOLD='\033[0;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GOLD}=====================================================================${NC}"
echo -e "${GOLD}  RASTA — SUPABASE POSTGRESQL PRODUCTION DATABASE CONFIGURATION    ${NC}"
echo -e "${GOLD}=====================================================================${NC}"

# Step 1: Check for DATABASE_URL in .env
if ! grep -q "postgresql://" .env 2>/dev/null && ! grep -q "postgres://" .env 2>/dev/null; then
    echo -e "${RED}[WARNING] Your .env file does not contain a PostgreSQL DATABASE_URL.${NC}"
    echo -e "Please edit your .env file and paste your Supabase connection string:"
    echo ""
    echo -e "  ${CYAN}DATABASE_URL=\"postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1\"${NC}"
    echo -e "  ${CYAN}DIRECT_URL=\"postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres\"${NC}"
    echo ""
    read -p "Have you updated your .env file with your Supabase credentials? [y/N]: " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo -e "${RED}Aborting Supabase switch. Please update .env first.${NC}"
        exit 1
    fi
fi

# Step 2: Copy PostgreSQL schema over schema.prisma
echo -e "${CYAN}[1/5] Switching prisma/schema.prisma to PostgreSQL provider...${NC}"
cp prisma/schema.supabase.prisma prisma/schema.prisma

# Step 3: Generate Prisma Client for PostgreSQL
echo -e "${CYAN}[2/5] Generating Prisma Client for PostgreSQL...${NC}"
npx prisma generate

# Step 4: Push schema to Supabase PostgreSQL database
echo -e "${CYAN}[3/5] Syncing 18-model schema to your Supabase PostgreSQL database...${NC}"
npx prisma db push

# Step 5: Seed & expand verified 200-variant catalog into Supabase
echo -e "${CYAN}[4/5] Seeding 40 canonical brands and 200 verified variants into Supabase...${NC}"
npm run db:seed
npx tsx scripts/expand-catalog.ts
npx tsx scripts/import-research-queue.ts
npx tsx scripts/ingest-official-photography.ts
npx tsx scripts/reconcile-database.ts

echo -e "${GREEN}[5/5] Supabase PostgreSQL Database configuration and seeding complete!${NC}"
echo -e "${GOLD}=====================================================================${NC}"
echo -e "${GREEN}  YOUR SUPABASE DATABASE NOW HOSTS 40 BRANDS • 200 VERIFIED VARIANTS ${NC}"
echo -e "${GOLD}=====================================================================${NC}"
echo ""
echo "Run 'npm run dev' or 'docker compose up' to launch RASTA connected to Supabase."
