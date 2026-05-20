import { teamMembers, teams } from "@/db/schema/teams"
import { factory } from "@/hono/lib/factory"
import { zValidatorError } from "@/hono/lib/validator"
import { authMiddleware } from "@/hono/middlewares/auth"
import { slugify } from "@/lib/utils"
import { addTeamSchema } from "@/teams/add/lib/schema"
import { zValidator } from "@hono/zod-validator"

export const teamRoutes = factory.createApp().use(authMiddleware)

teamRoutes.get(
  "/",
  async ({
    var: {
      db,
      user: { id: userId },
      send,
    },
  }) => {
    const teams = await db.query.teamMembers.findMany({
      columns: { permission: true, role: true },
      with: { team: { columns: { name: true, slug: true, location: true } } },
      where: (teamMembers, { eq }) => eq(teamMembers.userId, userId),
      orderBy: (teamMembers, { desc }) => desc(teamMembers.createdAt),
    })

    return send(teams)
  },
)

teamRoutes.get(
  "/:slug",
  async ({
    req,
    var: {
      db,
      user: { id: userId },
      fail,
      send,
    },
  }) => {
    const { slug } = req.param()

    const team = await db.query.teams.findFirst({
      columns: { id: true, location: true, name: true, slug: true },
      where: (teams, { eq }) => eq(teams.slug, slug),
    })

    if (!team) {
      return fail(404, "Team not found.")
    }

    const teamMember = await db.query.teamMembers.findFirst({
      columns: { permission: true },
      where: (teamMembers, { and, eq }) =>
        and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, userId)),
    })

    if (!teamMember) {
      return fail(404, "Team not found for the user.")
    }

    const members = await db.query.teamMembers.findMany({
      columns: { permission: true, role: true },
      with: { user: { columns: { name: true, email: true } } },
      where: (teamMembers, { eq }) => eq(teamMembers.teamId, team.id),
    })

    return send({
      team: { ...team, permission: teamMember.permission },
      members,
    })
  },
)

teamRoutes.post(
  "/",
  zValidator("json", addTeamSchema, zValidatorError),
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
      team: { location, name },
      user: { role },
    } = req.valid("json")

    const slug = slugify(name)

    const existingTeam = await db.query.teams.findFirst({
      columns: { id: true },
      where: (teams, { eq }) => eq(teams.slug, slug),
    })

    if (existingTeam) {
      return fail(400, "A team with the same name already exists.")
    }

    const teamId = await db.transaction(async (tx) => {
      const [{ teamId }] = await tx
        .insert(teams)
        .values({
          location,
          name,
          slug,
        })
        .returning({
          teamId: teams.id,
        })

      await tx.insert(teamMembers).values({
        permission: "admin",
        role,
        teamId,
        userId,
      })

      return teamId
    })

    return send({ teamId }, 201)
  },
)
