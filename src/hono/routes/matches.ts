import { matchParticipants, matches } from "@/db/schema/matches"
import { factory } from "@/hono/lib/factory"
import { zValidatorError } from "@/hono/lib/validator"
import { authMiddleware } from "@/hono/middlewares/auth"
import { addMatchSchema } from "@/matches/add/lib/schema"
import { editMatchReplyParams } from "@/matches/edit/lib/schema"
import { matchReplies } from "@/matches/lib/schema"
import { slugifyMatch } from "@/matches/lib/utils"
import { readMatchQueryParams } from "@/matches/read/lib/schema"
import { isUserTeamAdmin } from "@/teams/checks/is-user-team-admin"
import { userBelongsToTeam } from "@/teams/checks/user-belongs-to-team"
import { zValidator } from "@hono/zod-validator"
import { and, eq } from "drizzle-orm"

export const matchRoutes = factory
  .createApp()
  .use(authMiddleware)
  .get(
    "/",
    zValidator("query", readMatchQueryParams, zValidatorError),
    async ({
      req,
      var: {
        db,
        user: { id: userId },
        fail,
        send,
      },
    }) => {
      const { teamSlug } = req.valid("query")

      const teamIds: string[] = []

      if (teamSlug) {
        const [belongs, data] = await userBelongsToTeam({
          db,
          teamSlug,
          userId,
        })

        if (!belongs) {
          return fail(404, data.errorMessage)
        }

        teamIds.push(data.team.id)
      } else {
        const teams = await db.query.teamMembers.findMany({
          columns: { teamId: true },
          where: (teamMembers, { eq }) => eq(teamMembers.userId, userId),
        })

        teams.forEach((team) => teamIds.push(team.teamId))
      }

      const now = new Date()

      const baseConfig = {
        columns: {
          location: true,
          startDate: true,
          opponent: true,
          slug: true,
        },
        with: { team: { columns: { name: true } } },
      } satisfies Parameters<typeof db.query.matches.findMany>[0]

      const futureMatches = await db.query.matches.findMany({
        ...baseConfig,
        where: (matches, { and, inArray, gt }) =>
          and(inArray(matches.teamId, teamIds), gt(matches.startDate, now)),
        orderBy: (matches, { asc }) => asc(matches.startDate),
      })

      const pastMatches = await db.query.matches.findMany({
        ...baseConfig,
        where: (matches, { and, inArray, lt }) =>
          and(inArray(matches.teamId, teamIds), lt(matches.endDate, now)),
        orderBy: (matches, { desc }) => desc(matches.startDate),
      })

      return send({ futureMatches, pastMatches })
    },
  )
  .get(
    "/:matchSlug",
    async ({
      req,
      var: {
        db,
        user: { id: userId },
        fail,
        send,
      },
    }) => {
      const { matchSlug } = req.param()

      const match = await db.query.matches.findFirst({
        columns: { createdAt: false, updatedAt: false },
        with: { team: { columns: { name: true } } },
        where: (matches, { eq }) => eq(matches.slug, matchSlug),
      })

      if (!match) {
        return fail(404, "Match not found.")
      }

      const { teamId, id, ...matchWithoutIds } = match

      const isTeamMember = await db.query.teamMembers.findFirst({
        where: (teamMembers, { and, eq }) =>
          and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
      })

      if (!isTeamMember) {
        return fail(404, "Match not found for the user.")
      }

      const userParticipation = await db.query.matchParticipants.findFirst({
        columns: { reply: true },
        where: (matchParticipants, { and, eq }) =>
          and(
            eq(matchParticipants.matchId, id),
            eq(matchParticipants.userId, userId),
          ),
      })

      const participants = await db.query.matchParticipants.findMany({
        columns: { reply: true },
        with: { user: { columns: { id: true, name: true } } },
        where: (matchParticipants, { eq }) => eq(matchParticipants.matchId, id),
      })

      return send({
        match: matchWithoutIds,
        participants,
        reply: userParticipation?.reply ?? null,
      })
    },
  )
  .post(
    "/:matchSlug/:reply",
    zValidator("param", editMatchReplyParams, zValidatorError),
    async ({
      req,
      var: {
        db,
        user: { id: userId },
        fail,
        send,
      },
    }) => {
      const { matchSlug, reply } = req.valid("param")

      const match = await db.query.matches.findFirst({
        columns: { id: true, startDate: true },
        where: (matches, { eq }) => eq(matches.slug, matchSlug),
      })

      if (!match) {
        return fail(404, "Match not found.")
      }

      const { id, startDate } = match

      if (startDate < new Date()) {
        return fail(400, "Match has already started.")
      }

      const [updatedParticipant] = await db
        .update(matchParticipants)
        .set({ reply })
        .where(
          and(
            eq(matchParticipants.matchId, id),
            eq(matchParticipants.userId, userId),
          ),
        )
        .returning({
          reply: matchParticipants.reply,
        })

      if (!updatedParticipant) {
        return fail(404, "Match participation not found.")
      }

      return send(null)
    },
  )
  .post(
    "/",
    zValidator("json", addMatchSchema, zValidatorError),
    async ({
      req,
      var: {
        db,
        user: { id: userId },
        fail,
        send,
      },
    }) => {
      const {
        description,
        endDate,
        location,
        meetingDate,
        opponent,
        startDate,
        teamId,
      } = req.valid("json")

      const isTeamAdmin = await isUserTeamAdmin({ db, teamId, userId })

      if (!isTeamAdmin) {
        return fail(403, "You must be a team admin to create a match.")
      }

      const team = await db.query.teams.findFirst({
        columns: { slug: true },
        with: { members: { columns: { userId: true } } },
        where: (teams, { eq }) => eq(teams.id, teamId),
      })

      if (!team) {
        return fail(404, "Team not found.")
      }

      const matchId = await db.transaction(async (tx) => {
        const [{ matchId }] = await tx
          .insert(matches)
          .values({
            description,
            endDate,
            location,
            meetingDate,
            opponent,
            slug: slugifyMatch(team.slug),
            startDate,
            teamId,
          })
          .returning({ matchId: matches.id })

        await tx.insert(matchParticipants).values(
          team.members.map((member) => ({
            matchId,
            userId: member.userId,
            reply: matchReplies.enum.awaiting,
          })),
        )

        return matchId
      })

      return send({ matchId }, 201)
    },
  )
