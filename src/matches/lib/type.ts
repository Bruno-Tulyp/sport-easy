import { matchReplies } from "@/matches/lib/schema"
import z from "zod"

export type MatchReplies = z.infer<typeof matchReplies>
