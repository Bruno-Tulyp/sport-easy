import { config } from "@/config"
import * as auth from "@/db/schema/auth"
import * as matches from "@/db/schema/matches"
import * as teams from "@/db/schema/teams"
import { drizzle } from "drizzle-orm/node-postgres"

export const db = drizzle({
  connection: config.database.connectionString,
  casing: "snake_case",
  schema: {
    ...auth,
    ...matches,
    ...teams,
  },
})
