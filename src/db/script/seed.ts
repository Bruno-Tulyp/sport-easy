import "dotenv/config"

import { db } from "@/db"
import seedMatches from "@/db/seed/matches"
import seedTeams from "@/db/seed/teams"
import seedUsers from "@/db/seed/users"

const seed = async () => {
  console.log("🌱 Seeding database...")

  const userIds = await seedUsers()

  const teams = await seedTeams(db, userIds)

  await seedMatches(db, teams)

  console.log("✅ Database seeded successfully!")

  process.exit(0)
}

seed()
