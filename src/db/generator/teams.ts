import { teamInvitations, teamMembers, teams } from "@/db/schema/teams"
import { slugify } from "@/lib/utils"
import { teamMemberPermissions, teamMemberRoles } from "@/teams/lib/schema"
import { TeamMemberPermissions } from "@/teams/lib/type"
import { faker } from "@faker-js/faker"

export const teamGenerator = (name: string) =>
  ({
    location: faker.location.streetAddress(),
    name,
    slug: slugify(name),
  }) satisfies typeof teams.$inferInsert

export const teamMemberGenerator = ({
  permission,
  teamId,
  userId,
}: {
  permission: TeamMemberPermissions
  teamId: string
  userId: string
}) =>
  ({
    permission,
    role: faker.helpers.arrayElement(teamMemberRoles.options),
    teamId,
    userId,
  }) satisfies typeof teamMembers.$inferInsert

export const teamInvitationGenerator = (teamId: string) =>
  ({
    email: faker.internet.email(),
    permission: faker.helpers.arrayElement(teamMemberPermissions.options),
    role: faker.helpers.arrayElement(teamMemberRoles.options),
    teamId,
  }) satisfies typeof teamInvitations.$inferInsert
