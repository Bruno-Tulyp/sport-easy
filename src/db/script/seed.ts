import "dotenv/config"

import { db } from "@/db"
import seedMatches from "@/db/seed/matches"
import seedTeams from "@/db/seed/teams"
import seedUsers from "@/db/seed/users"

const seed = async () => {
  console.log("🌱 Seeding database...")

  const userIds = await seedUsers()

  console.log(`👤 Seeded ${userIds.length} users.`)

  const teams = await seedTeams(db, userIds)

  console.log(`⚽ Seeded ${teams.length} teams.`)

  await seedMatches(db, teams)

  console.log(`🏆 Seeded matches for ${teams.length} teams.`)

  console.log("✅ Database seeded successfully!")

  process.exit(0)
}

seed()
