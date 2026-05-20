import z from "zod"

export const readMatchQueryParams = z.object({
  teamSlug: z.string().optional(),
})
