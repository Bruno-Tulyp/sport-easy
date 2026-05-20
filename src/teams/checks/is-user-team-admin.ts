import { DbClient } from "@/db/lib/type"

export const isUserTeamAdmin = async ({
  db,
  teamId,
  userId,
}: {
  db: DbClient
  teamId: string
  userId: string
}) => {
  const teamMember = await db.query.teamMembers.findFirst({
    where: (teamMembers, { and, eq }) =>
      and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
        eq(teamMembers.permission, "admin"),
      ),
  })

  return !!teamMember
}
