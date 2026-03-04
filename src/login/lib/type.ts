import { loginFormSchema } from "@/login/lib/schema"
import z from "zod"

export type LoginFormOutput = z.infer<typeof loginFormSchema>
