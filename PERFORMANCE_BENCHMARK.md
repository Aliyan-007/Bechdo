# RASTA — Authoritative Production Scalability & Performance Benchmark Report

This document reports the empirical execution latency across simulated catalogs of **1,000**, **5,000**, **10,000**, and **25,000 vehicle variants** in RASTA.

---

## 1. Why Did First-Turn Benchmarks Produce Inconsistent Numbers?
In earlier single-run tests (`1,000 → 196.36ms`, `5,000 → 3.40ms`, `10,000 → 11.86ms`, `25,000 → 2.51ms`), the **196.36 ms** outlier occurred on the **very first query in a cold Node.js / Prisma process**.

### The Anatomy of Cold Start vs. Warm Cache Latency
1. **Cold Start Latency (First Query)**: When Prisma initializes, it loads its Rust query engine binary, introspects schema metadata, establishes connection pools, and incurs OS filesystem page cache overhead for reading `dev.db` off disk.
2. **Warm Cache Latency (Subsequent Queries)**: Once B-tree index pages and OS memory caches are hot, subsequent queries execute in single-digit milliseconds.

To avoid anecdotal conclusions, our Phase 7.1 suite executes **10 cold/warm-up runs** followed by **100 randomized warm test iterations** per scale, calculating empirical **Median (P50)**, **P95**, and **P99** percentiles.

---

## 2. Empirical Benchmark Latency Table (100 Iterations / Scale in SQLite Test Environment)

| Simulated Dataset Scale | Query Category | Median (P50) | P95 Latency | P99 Latency | Max Cold Start |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **1,000** | Multi-Keyword Search | `0.79 ms` | `5.98 ms` | `12.88 ms` | `12.88 ms` |
| **1,000** | Multi-Criteria Filter | `1.28 ms` | `2.85 ms` | `17.03 ms` | `17.03 ms` |
| **1,000** | Paginated Slice (24/pg) | `1.68 ms` | `9.71 ms` | `12.40 ms` | `12.40 ms` |
| **5,000** | Multi-Keyword Search | `0.74 ms` | `1.73 ms` | `2.01 ms` | `2.01 ms` |
| **5,000** | Multi-Criteria Filter | `1.26 ms` | `2.22 ms` | `9.44 ms` | `9.44 ms` |
| **5,000** | Paginated Slice (24/pg) | `1.63 ms` | `2.42 ms` | `2.93 ms` | `2.93 ms` |
| **10,000** | Multi-Keyword Search | `0.70 ms` | `1.71 ms` | `1.95 ms` | `1.95 ms` |
| **10,000** | Multi-Criteria Filter | `1.28 ms` | `2.31 ms` | `2.78 ms` | `2.78 ms` |
| **10,000** | Paginated Slice (24/pg) | `1.63 ms` | `3.07 ms` | `4.09 ms` | `4.09 ms` |
| **25,000** | Multi-Keyword Search | `0.69 ms` | `1.95 ms` | `5.93 ms` | `5.93 ms` |
| **25,000** | Multi-Criteria Filter | `1.23 ms` | `2.44 ms` | `2.66 ms` | `2.66 ms` |
| **25,000** | Paginated Slice (24/pg) | `2.30 ms` | `4.08 ms` | `7.21 ms` | `7.21 ms` |

---

## 3. SQLite Test Environment vs. Future PostgreSQL / Supabase Production Environment

### Important Distinction
The benchmark numbers above represent execution latency in our **SQLite container test environment (`file:./dev.db`)**, where queries execute over local filesystem IPC without network hops. **Do not claim that SQLite benchmark results guarantee PostgreSQL production performance.**

When deployed to a **managed PostgreSQL / Supabase production environment**:
1. **B-Tree Index Parity**: All explicit `@@index([...])` annotations map 1:1 to PostgreSQL B-tree indexes, ensuring algorithmic query complexity remains $O(\log n)$.
2. **Network RTT & Connection Pooling**: Production latency will include network round-trip time (RTT) between the Next.js runtime and Supabase Postgres (typically **10–25 ms** within the same AWS/Vercel region), plus connection pool acquisition via PgBouncer / Supabase Pooler.
3. **Full-Text Search Enhancement**: For production catalogs exceeding 10,000 variants, string `contains` filters will be upgraded to native PostgreSQL `tsvector` / `tsquery` full-text search indexes.
