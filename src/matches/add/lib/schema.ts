import { uuid } from "@/lib/schema"
import z from "zod"

export const addMatchSchema = z.object({
  description: z.string().min(1, "Description is required").nullable(),
  endDate: z.coerce.date(),
  location: z.string().min(1, "Location is required"),
  meetingDate: z.coerce.date(),
  opponent: z.string().min(1, "Opponent is required"),
  startDate: z.coerce.date(),
  teamId: uuid,
})
