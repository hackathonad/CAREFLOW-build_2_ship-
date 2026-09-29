# CareFlow AI - Database Architecture & Supabase Guide

This directory houses the PostgreSQL database schema, migrations, seed data, and raw reference datasets for CareFlow AI.

## Database Engine: Supabase PostgreSQL

CareFlow AI is designed to use **Supabase PostgreSQL (v15+)** as its operational persistence store.

### Directory Structure

```
database/
  migrations/
    001_initial_schema.sql    # Full PostgreSQL schema with tables, relationships, and constraints
  seed/
    seed.sql                  # Comprehensive synthetic seed data (departments, doctors, patients, beds, inventory, ambulances, tasks)
  raw-data/                   # Reference datasets and government open data caches (NDHM/data.gov.in)
  import/                     # Data ingestion scripts and loaders
  schema/                     # ERD diagrams and documentation
```

### Running Migrations in Supabase

1. Open your Supabase Project Dashboard (`https://supabase.com/dashboard/project/<your-project-id>`).
2. Navigate to **SQL Editor** in the left sidebar.
3. Click **New Query**, paste the contents of `database/migrations/001_initial_schema.sql`, and click **Run**.
4. To load synthetic demo data, create another query, paste `database/seed/seed.sql`, and click **Run**.

### Offline / Hybrid Resiliency Mode

The CareFlow AI backend includes an intelligent data layer. If `SUPABASE_URL` and `SUPABASE_ANON_KEY` are not configured in your `.env`, the backend automatically falls back to the high-fidelity in-memory synthetic operations repository. Once your Supabase credentials are provided, live PostgreSQL queries take over seamlessly with zero code modifications.

### Security Guardrails
- **No Medical/Clinical Diagnostics**: All tables are strictly hospital operational management models.
- **Backend-Only Access**: Supabase service keys and credentials must NEVER be placed in client-side bundles or frontend environment variables.
