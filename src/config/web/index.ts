import z from "zod"

const configSchema = z.object({
  apiUrl: z.url(),
})

export const config = configSchema.parse({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
})
