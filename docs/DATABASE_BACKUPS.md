# RASTA — Production Database Backup & Disaster Recovery Guide

This document outlines the backup, restoration, migration rollback, and seed recovery procedures for the **RASTA Automotive Intelligence Platform**.

---

## 1. Backup Strategy

### A. Managed PostgreSQL / Supabase (Production & Staging)
* **Automated Daily Backups**: Supabase automatically captures daily physical backups and point-in-time recovery (PITR) logs for production databases.
* **Manual Snapshot / pg_dump**:
  To export a complete SQL dump of production before major schema migrations:
  ```bash
  pg_dump --clean --if-exists --no-owner --no-privileges -d "$DATABASE_URL" > backups/rasta_prod_$(date +%Y%m%d_%H%M%S).sql
  ```
* **Data-Only Export (JSON)**:
  You can also export verified variants directly from Prisma for catalog archiving:
  ```bash
  npx tsx scripts/generate-catalog.ts
  ```

### B. Local Development SQLite (`dev.db`)
For local development, back up the SQLite database file before testing destructive mutations:
```bash
cp dev.db dev_backup_$(date +%Y%m%d).db
```

---

## 2. Restoration & Disaster Recovery

### A. Restoring PostgreSQL from SQL Dump
To restore production or staging from a verified `pg_dump` snapshot:
```bash
psql -d "$DATABASE_URL" -f backups/rasta_prod_20260809_120000.sql
```

### B. Idempotent Seed Recovery (`npm run db:seed`)
If a database instance is accidentally reset or spun up in a new region, RASTA can recover 100% of verified variants, brands, specifications, images, and historical events without SQL dumps by running our idempotent import engine:
```bash
npx prisma migrate deploy   # Apply production SQL schema migrations
npm run db:seed             # Re-import 118+ verified variants idempotently
```
Because `src/lib/importer.ts` uses safe UPSERT operations, running `npm run db:seed` against an existing or freshly provisioned database will restore all catalog records without duplicate key errors.

---

## 3. Migration Rollback Protocol

When applying schema migrations with Prisma:
1. **Never use `prisma migrate reset` in production**.
2. If a migration introduces a breaking change:
   * Revert the schema change in `prisma/schema.prisma`.
   * Generate a corrective migration:
     ```bash
     npx prisma migrate dev --name revert_breaking_change
     ```
   * Deploy the corrective migration to production:
     ```bash
     npx prisma migrate deploy
     ```
