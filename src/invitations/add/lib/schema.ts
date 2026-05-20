import { email, uuid } from "@/lib/schema"
import { teamMemberPermissions, teamMemberRoles } from "@/teams/lib/schema"
import z from "zod"

export const addInvitationSchema = z.object({
  teamId: uuid,
  email,
  permission: teamMemberPermissions,
  role: teamMemberRoles,
})
