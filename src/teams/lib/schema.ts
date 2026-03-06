import z from "zod"

export const teamMemberPermissions = z.enum(["admin", "member"])

export const teamMemberRoles = z.enum(["coach", "player", "staff"])
