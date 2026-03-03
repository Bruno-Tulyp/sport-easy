import { config } from "@/config"
import { drizzle } from "drizzle-orm/node-postgres"
import * as auth from "@/db/schema/auth"

export const db = drizzle({
  connection: config.database.connectionString,
  casing: "snake_case",
  schema: {
    ...auth,
  },
})
