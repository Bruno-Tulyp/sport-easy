import { DbClient } from "@/db/lib/type"

export const userBelongsToTeam = async ({
  db,
  teamSlug,
  userId,
}: {
  db: DbClient
  teamSlug: string
  userId: string
}) => {
  const team = await db.query.teams.findFirst({
    columns: { id: true, location: true, name: true, slug: true },
    where: (teams, { eq }) => eq(teams.slug, teamSlug),
  })

  if (!team) {
    return [false, { errorMessage: "Team not found." }] as const
  }

  const teamMember = await db.query.teamMembers.findFirst({
    columns: { permission: true },
    where: (teamMembers, { and, eq }) =>
      and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, userId)),
  })

  if (!teamMember) {
    return [false, { errorMessage: "Team not found for the user." }] as const
  }

  return [true, { team, permission: teamMember.permission }] as const
}
