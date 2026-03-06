import { timestamps } from "@/db/lib/helpers"
import { users } from "@/db/schema/auth"
import { TeamMemberPermissions, TeamMemberRoles } from "@/teams/lib/type"
import { relations } from "drizzle-orm"
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core"

export const teams = pgTable("teams", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  location: text().notNull(),
  ...timestamps,
})

export const teamMembers = pgTable(
  "team_members",
  {
    teamId: uuid()
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    permission: text().notNull().$type<TeamMemberPermissions>(),
    role: text().notNull().$type<TeamMemberRoles>(),
    ...timestamps,
  },
  (t) => [unique().on(t.teamId, t.userId)],
)

export const teamInvitations = pgTable(
  "team_invitations",
  {
    id: uuid().defaultRandom().primaryKey(),
    teamId: uuid()
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    email: text().notNull(),
    permission: text().notNull().$type<TeamMemberPermissions>(),
    role: text().notNull().$type<TeamMemberRoles>(),
    ...timestamps,
  },
  (t) => [unique().on(t.teamId, t.email)],
)

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}))

export const teamInvitationsRelations = relations(
  teamInvitations,
  ({ one }) => ({
    team: one(teams, {
      fields: [teamInvitations.teamId],
      references: [teams.id],
    }),
  }),
)
