import { teamMemberPermissions, teamMemberRoles } from "@/teams/lib/schema"
import z from "zod"

export type TeamMemberPermissions = z.infer<typeof teamMemberPermissions>

export type TeamMemberRoles = z.infer<typeof teamMemberRoles>
