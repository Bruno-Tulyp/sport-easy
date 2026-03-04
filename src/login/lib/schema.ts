import { email, requiredField } from "@/lib/schema"
import z from "zod"

export const loginFormSchema = z.object({
  email,
  password: requiredField,
})
