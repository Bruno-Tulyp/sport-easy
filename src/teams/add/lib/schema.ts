import { teamMemberRoles } from "@/teams/lib/schema"
import z from "zod"

export const addTeamSchema = z.object({
  team: z.object({
    location: z.string().min(1, "Location is required"),
    name: z.string().min(1, "Name is required"),
  }),
  user: z.object({
    role: teamMemberRoles,
  }),
})
