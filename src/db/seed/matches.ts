import { db } from "@/db"
import {
  matchGenerator,
  matchParticipantGenerator,
} from "@/db/generator/matches"
import { matches, matchParticipants } from "@/db/schema/matches"
import { faker } from "@faker-js/faker"

const seedMatches = async (
  dbClient: typeof db,
  teams: {
    id: string
    slug: string
  }[],
) =>
  dbClient.transaction(async (tx) => {
    const matchValues = faker.helpers.multiple(
      () => {
        const { id, slug } = faker.helpers.arrayElement(teams)

        return matchGenerator(id, slug)
      },
      { count: teams.length * 5 },
    )

    const matchResults = await tx
      .insert(matches)
      .values(matchValues)
      .returning({ id: matches.id, teamId: matches.teamId })

    for (const match of matchResults) {
      const teamMembers = await tx.query.teamMembers.findMany({
        where: (t, { eq }) => eq(t.teamId, match.teamId),
      })

      const participantValues = teamMembers.map(({ userId }) =>
        matchParticipantGenerator(match.id, userId),
      )

      await tx.insert(matchParticipants).values(participantValues)
    }
  })

export default seedMatches
