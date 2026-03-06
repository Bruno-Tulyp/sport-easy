import z from "zod"

export const matchReplies = z.enum(["accepted", "declined", "awaiting"])
