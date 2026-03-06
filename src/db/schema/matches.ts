import { timestamps } from "@/db/lib/helpers"
import { users } from "@/db/schema/auth"
import { teams } from "@/db/schema/teams"
import { MatchReplies } from "@/matches/lib/type"
import { relations, sql } from "drizzle-orm"
import {
  check,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"

export const matches = pgTable(
  "matches",
  {
    id: uuid().defaultRandom().primaryKey(),
    teamId: uuid()
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    opponent: text().notNull(),
    description: text(),
    meetingDate: timestamp().notNull(),
    startDate: timestamp().notNull(),
    endDate: timestamp().notNull(),
    location: text().notNull(),
    slug: text().notNull().unique(),
    ...timestamps,
  },
  (t) => [
    unique().on(t.teamId, t.startDate),
    check("date_check1", sql`${t.endDate} > ${t.startDate}`),
    check("date_check2", sql`${t.startDate} > ${t.meetingDate}`),
  ],
)

export const matchParticipants = pgTable(
  "match_participants",
  {
    matchId: uuid()
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reply: text().notNull().$type<MatchReplies>(),
    ...timestamps,
  },
  (t) => [unique().on(t.matchId, t.userId)],
)

export const matchesRelations = relations(matches, ({ many }) => ({
  participants: many(matchParticipants),
}))

export const matchParticipantsRelations = relations(
  matchParticipants,
  ({ one }) => ({
    match: one(matches, {
      fields: [matchParticipants.matchId],
      references: [matches.id],
    }),
    user: one(users, {
      fields: [matchParticipants.userId],
      references: [users.id],
    }),
  }),
)
