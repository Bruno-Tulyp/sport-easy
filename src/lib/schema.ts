import z from "zod"

export const requiredField = z.string().min(1, "Field is required")

export const requiredTrimmedField = requiredField.trim()

export const email = z.email()
