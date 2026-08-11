# RASTA — Production Deployment & Infrastructure Guide

This document defines the production infrastructure, deployment pipeline, database engine transition, and security configuration for the **RASTA Automotive Intelligence Platform**.

---

## 1. Multi-Environment Deployment Architecture

RASTA uses a 3-tier deployment pipeline to ensure database integrity and zero-downtime updates:

```
[Development Environment]
  ├── Database: SQLite (`file:./dev.db`)
  ├── Authentication: Demo credentials enabled (`ALLOW_DEMO_CREDENTIALS=true`)
  └── Asset Storage: Local SVG Data-URI fallbacks + CDN previews

[Staging Environment]
  ├── Database: Supabase PostgreSQL (Staging Branch)
  ├── Authentication: Supabase Auth / Staging Admin Accounts
  └── Asset Storage: Supabase Storage (`vehicles-staging` bucket)

[Production Environment]
  ├── Database: Managed Supabase PostgreSQL (`DATABASE_URL`)
  ├── Authentication: Production Supabase Auth / Hardened Session Tokens
  └── Asset Storage: Supabase Storage (`NEXT_PUBLIC_IMAGE_CDN`)
```

---

## 2. Environment Variables Configuration

Copy `.env.example` to your production deployment secrets:

```env
# 1. DATABASE CONNECTION
# Production Managed PostgreSQL (Supabase / Vercel Postgres / AWS RDS):
DATABASE_URL="postgresql://postgres:SECRET_PASSWORD@db.production-ref.supabase.co:5432/postgres?schema=public"

# 2. IMAGE CDN & SUPABASE STORAGE PREFIX
NEXT_PUBLIC_IMAGE_CDN="https://your-ref.supabase.co/storage/v1/object/public/vehicle-gallery"

# 3. PRODUCTION AUTHENTICATION FLAGS
NODE_ENV="production"
# Disable hardcoded demo credentials in production:
ALLOW_DEMO_CREDENTIALS="false"
NEXT_PUBLIC_SUPABASE_URL="https://your-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
# NEVER commit SUPABASE_SERVICE_ROLE_KEY to client bundles!
```

---

## 3. Database Engine Transition (SQLite → Supabase PostgreSQL)

Because RASTA uses **Prisma 7**, transitioning from SQLite to PostgreSQL requires zero application code changes:
1. In `prisma/schema.prisma`, set `provider = "postgresql"`.
2. Run Prisma migrations against the production PostgreSQL instance:
   ```bash
   npx prisma migrate deploy
   ```
3. Execute our idempotent seed and import script:
   ```bash
   npm run db:seed
   ```
   Because `src/lib/importer.ts` uses safe UPSERT operations, all **160 verified variants**, **36 brands**, **640 images**, **160 price records**, **29 timeline events**, and **10 variant aliases** seed cleanly into PostgreSQL without duplicate key errors.

---

## 4. Production Security & Authorization Checklist

Before public launch, verify the following security controls:
- [x] **Server-Side Authorization**: Every Server Action (`createBrandAction`, `createVehicleAction`, `deleteVehicleAction`, `updatePriceAction`, `reviewCorrectionReportAction`, `manageImageAction`) calls `requireAuth()` server-side.
- [x] **Demo Accounts Disabled**: When `NODE_ENV="production"`, `allowDemo` is `false` unless explicitly overridden.
- [x] **Audit Log Oversight**: All mutations write immutable entries to `AuditLog`, inspectable via `/admin`.
- [x] **Destructive Deletion Confirmation**: Admin portal displays an explicit confirmation modal before executing `deleteVehicleAction(id)`.
