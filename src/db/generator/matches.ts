import { matches, matchParticipants } from "@/db/schema/matches"
import { matchReplies } from "@/matches/lib/schema"
import { faker } from "@faker-js/faker"

const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000
const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000

export const matchGenerator = (teamId: string, teamSlug: string) => {
  const startDate = faker.date.anytime()
  const meetingDate = new Date(startDate.getTime() - THIRTY_MINUTES_IN_MS)
  const endDate = new Date(startDate.getTime() + TWO_HOURS_IN_MS)

  return {
    endDate,
    location: faker.location.streetAddress(),
    meetingDate,
    opponent: faker.company.name(),
    slug: `match-${teamSlug}-${faker.string.alphanumeric(10)}`,
    startDate,
    teamId,
    description: faker.helpers.arrayElement([faker.lorem.paragraph(), null]),
  } satisfies typeof matches.$inferInsert
}

export const matchParticipantGenerator = (matchId: string, userId: string) =>
  ({
    matchId,
    reply: faker.helpers.arrayElement(matchReplies.options),
    userId,
  }) satisfies typeof matchParticipants.$inferInsert
