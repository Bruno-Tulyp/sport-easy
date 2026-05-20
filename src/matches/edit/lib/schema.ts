import { matchReplies } from "@/matches/lib/schema"
import z from "zod"

export const editMatchReplyParams = z.object({
  matchSlug: z.string(),
  reply: matchReplies,
})
