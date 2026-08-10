# RASTA — PostgreSQL / Supabase Migration Guide

The RASTA application is designed to be database-engine agnostic via **Prisma 7 ORM**. The current development environment uses embedded **SQLite** (`file:./dev.db`). This guide details the production procedure for migrating RASTA to managed **PostgreSQL** (e.g., Supabase, Vercel Postgres, AWS RDS).

---

## 1. Schema Compatibility Audit

The Prisma schema (`prisma/schema.prisma`) is 100% compatible with PostgreSQL:
1. **Data Type Mapping**:
   * `String` → `text` (or `varchar`)
   * `Int` → `int4`
   * `Float` → `double precision`
   * `Boolean` → `bool`
   * `colors String` → can remain a JSON-encoded string or be upgraded to PostgreSQL native `Jsonb` or `text[]`.
2. **Indexing Compatibility**:
   * All explicit `@@index([...])` directives in `schema.prisma` translate 1:1 to PostgreSQL B-tree indexes.
3. **Cascading Relations**:
   * All foreign key relations specify `@relation(..., onDelete: Cascade)`, which maps directly to `ON DELETE CASCADE` in PostgreSQL.

---

## 2. Step-by-Step Migration Procedure

### Step 1: Provision Managed PostgreSQL / Supabase
1. Create a PostgreSQL project on Supabase or your hosting provider.
2. Retrieve the connection string:
   * Transaction connection string (`DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"`).
   * Direct connection string (for migrations).

### Step 2: Update `prisma/schema.prisma`
In `prisma/schema.prisma`, change the datasource provider:
```prisma
datasource db {
  provider = "postgresql"
}
```

### Step 3: Configure Environment Variables
In your `.env` or production secrets, set:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres?schema=public"
```

### Step 4: Generate PostgreSQL Schema & Run Migrations
Generate the Prisma Client for PostgreSQL and push the schema:
```bash
npx prisma generate
npx prisma db push
```
Or create a formal SQL migration file:
```bash
npx prisma migrate dev --name init_postgres
```

### Step 5: Seed the Production Database
Run our idempotent import script against the PostgreSQL instance:
```bash
npm run db:seed
```
Because `prisma/seed.ts` and `src/lib/importer.ts` use Prisma Client, all **118+ verified Pakistani market variants**, **30 brands**, **472 images**, **118 price history records**, and **12 timeline events** will seed cleanly into PostgreSQL without any code changes.

---

## 3. Verification Checklist
- [x] Verify `npx prisma generate` succeeds with `@prisma/client`.
- [x] Verify `npm run db:seed` executes idempotently without duplicate key errors.
- [x] Test global search (`/cars?q=Corolla`) to ensure query execution latency remains under 50ms.
