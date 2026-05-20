import { teamMembers, teams } from "@/db/schema/teams"
import { factory } from "@/hono/lib/factory"
import { zValidatorError } from "@/hono/lib/validator"
import { authMiddleware } from "@/hono/middlewares/auth"
import { slugify } from "@/lib/utils"
import { addTeamSchema } from "@/teams/add/lib/schema"
import { userBelongsToTeam } from "@/teams/checks/user-belongs-to-team"
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
  "/:teamSlug",
  async ({
    req,
    var: {
      db,
      user: { id: userId },
      fail,
      send,
    },
  }) => {
    const { teamSlug } = req.param()

    const [belongs, data] = await userBelongsToTeam({
      db,
      teamSlug,
      userId,
    })

    if (!belongs) {
      return fail(404, data.errorMessage)
    }

    const { permission, team } = data

    const members = await db.query.teamMembers.findMany({
      columns: { permission: true, role: true },
      with: { user: { columns: { name: true, email: true } } },
      where: (teamMembers, { eq }) => eq(teamMembers.teamId, team.id),
    })

    return send({ team, members, permission })
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
