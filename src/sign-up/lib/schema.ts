import { email, requiredField, trimmedString } from "@/lib/schema"
import z from "zod"

export const signUpFormSchema = z.object({
  name: requiredField,
  email,
  password: trimmedString
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter",
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "Password must contain at least one lowercase letter",
    )
    .refine(
      (password) => /[0-9]/.test(password),
      "Password must contain at least one number",
    )
    .refine(
      (password) => /[!@#$%^&*]/.test(password),
      "Password must contain at least one special character",
    ),
})
