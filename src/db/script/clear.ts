import "dotenv/config"

import { db } from "@/db"
import { sql } from "drizzle-orm"

const clear = async () => {
  console.log("📊 Dropping all tables...")

  await db.execute(sql`
      -- Delete all tables
      
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
              EXECUTE 'DROP TABLE ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;

      DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE;
  `)

  console.log("✅ All tables dropped")

  process.exit(0)
}

clear()
