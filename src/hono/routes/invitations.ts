import { teamInvitations, teamMembers } from "@/db/schema/teams"
import { factory } from "@/hono/lib/factory"
import { zValidatorError } from "@/hono/lib/validator"
import { authMiddleware } from "@/hono/middlewares/auth"
import { addInvitationSchema } from "@/invitations/add/lib/schema"
import { paramUuid } from "@/lib/schema"
import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"

export const invitationRoutes = factory.createApp().use(authMiddleware)

invitationRoutes.get(
  "/",
  async ({
    var: {
      db,
      user: { email },
      send,
    },
  }) => {
    const invitations = await db.query.teamInvitations.findMany({
      columns: { id: true, permission: true, role: true },
      with: { team: { columns: { name: true, slug: true, location: true } } },
      where: (teamInvitations, { eq }) => eq(teamInvitations.email, email),
      orderBy: (teamInvitations, { desc }) => desc(teamInvitations.createdAt),
    })

    return send(invitations)
  },
)

invitationRoutes.post(
  "/:id/accept",
  zValidator("param", paramUuid, zValidatorError),
  async ({
    req,
    var: {
      db,
      user: { email, id: userId },
      fail,
      send,
    },
  }) => {
    const { id } = req.valid("param")

    const invitation = await db.query.teamInvitations.findFirst({
      columns: { teamId: true, permission: true, role: true },
      where: (teamInvitations, { and, eq }) =>
        and(eq(teamInvitations.id, id), eq(teamInvitations.email, email)),
    })

    if (!invitation) {
      return fail(404, "Invitation not found.")
    }

    const { permission, role, teamId } = invitation

    await db.transaction(async (tx) => {
      await tx.insert(teamMembers).values({
        permission,
        role,
        teamId,
        userId,
      })

      await tx.delete(teamInvitations).where(eq(teamInvitations.id, id))
    })

    return send(null)
  },
)

invitationRoutes.post(
  "/:id/decline",
  zValidator("param", paramUuid, zValidatorError),
  async ({
    req,
    var: {
      db,
      user: { email },
      fail,
      send,
    },
  }) => {
    const { id } = req.valid("param")

    const invitation = await db.query.teamInvitations.findFirst({
      columns: { id: true },
      where: (teamInvitations, { and, eq }) =>
        and(eq(teamInvitations.id, id), eq(teamInvitations.email, email)),
    })

    if (!invitation) {
      return fail(404, "Invitation not found.")
    }

    await db.delete(teamInvitations).where(eq(teamInvitations.id, id))

    return send(null)
  },
)

invitationRoutes.post(
  "/",
  zValidator("json", addInvitationSchema, zValidatorError),
  async ({
    req,
    var: {
      db,
      user: { id: userId },
      fail,
      send,
    },
  }) => {
    const { teamId, email, permission, role } = req.valid("json")

    const isTeamAdmin = await db.query.teamMembers.findFirst({
      where: (teamMembers, { and, eq }) =>
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, userId),
          eq(teamMembers.permission, "admin"),
        ),
    })

    if (!isTeamAdmin) {
      return fail(403, "You must be a team admin to invite others.")
    }

    const user = await db.query.users.findFirst({
      columns: { id: true },
      where: (users, { eq }) => eq(users.email, email),
    })

    if (user) {
      const isAlreadyMember = await db.query.teamMembers.findFirst({
        where: (teamMembers, { and, eq }) =>
          and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, user.id)),
      })

      if (isAlreadyMember) {
        return fail(409, "This user is already a member of the team.")
      }
    }

    const invitation = await db.query.teamInvitations.findFirst({
      where: (teamInvitations, { and, eq }) =>
        and(
          eq(teamInvitations.teamId, teamId),
          eq(teamInvitations.email, email),
        ),
    })

    if (invitation) {
      return fail(409, "An invitation has already been sent to this email.")
    }

    const [{ invitationId }] = await db
      .insert(teamInvitations)
      .values({
        teamId,
        email,
        permission,
        role,
      })
      .returning({
        invitationId: teamInvitations.id,
      })

    return send({ invitationId }, 201)
  },
)
