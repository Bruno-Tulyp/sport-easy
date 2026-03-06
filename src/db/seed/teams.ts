import { db } from "@/db"
import {
  teamGenerator,
  teamInvitationGenerator,
  teamMemberGenerator,
} from "@/db/generator/teams"
import { teamInvitations, teamMembers, teams } from "@/db/schema/teams"
import { faker } from "@faker-js/faker"

const TEAM_NAMES = [
  "Red Dragons",
  "Blue Sharks",
  "Green Tigers",
  "Yellow Lions",
  "Purple Eagles",
  "Orange Wolves",
  "Black Panthers",
  "White Bears",
  "Silver Foxes",
  "Golden Hawks",
]

const seedTeams = async (dbClient: typeof db, userIds: string[]) =>
  dbClient.transaction(async (tx) => {
    const teamResults = await tx
      .insert(teams)
      .values(TEAM_NAMES.map((name) => teamGenerator(name)))
      .returning({ id: teams.id, slug: teams.slug })

    const teamIds = teamResults.map(({ id }) => id)

    const teamMemberValues = userIds.map((userId, index) => {
      const isAdmin = index < teamIds.length

      return teamMemberGenerator({
        permission: isAdmin ? "admin" : "member",
        teamId: isAdmin ? teamIds[index] : faker.helpers.arrayElement(teamIds),
        userId,
      })
    })

    await tx.insert(teamMembers).values(teamMemberValues)

    await tx
      .insert(teamInvitations)
      .values(
        faker.helpers.multiple(
          () => teamInvitationGenerator(faker.helpers.arrayElement(teamIds)),
          { count: TEAM_NAMES.length * 3 },
        ),
      )

    return teamResults
  })

export default seedTeams
