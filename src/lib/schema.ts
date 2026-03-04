import z from "zod"

export const trimmedString = z.string().trim()

export const requiredField = trimmedString.min(1, "Field is required")

export const email = z.email()
