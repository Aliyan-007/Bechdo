#!/usr/bin/env bash
# ==============================================================================
# RASTA — SWITCH DATABASE ENGINE TO LOCAL SQLITE (dev.db)
# ==============================================================================
# This script switches RASTA back to local SQLite development database (dev.db).
# ==============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
GOLD='\033[0;33m'
NC='\033[0m'

echo -e "${GOLD}=====================================================================${NC}"
echo -e "${GOLD}  RASTA — SWITCHING TO LOCAL SQLITE DEVELOPMENT DATABASE (dev.db)    ${NC}"
echo -e "${GOLD}=====================================================================${NC}"

echo -e "${CYAN}[1/4] Configuring .env for local SQLite...${NC}"
cat <<EOF > .env
DATABASE_URL="file:./dev.db"
EOF

echo -e "${CYAN}[2/4] Restoring SQLite datasource in prisma/schema.prisma...${NC}"
cat <<EOF > /tmp/schema_sqlite_top.txt
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
}
EOF
tail -n +10 prisma/schema.supabase.prisma >> /tmp/schema_sqlite_top.txt
cp /tmp/schema_sqlite_top.txt prisma/schema.prisma
rm /tmp/schema_sqlite_top.txt

echo -e "${CYAN}[3/4] Generating Prisma Client for SQLite...${NC}"
npx prisma generate
npx prisma db push

echo -e "${GREEN}[4/4] SQLite configuration complete! Using file:./dev.db.${NC}"
