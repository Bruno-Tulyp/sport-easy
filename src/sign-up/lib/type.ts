import { signUpFormSchema } from "@/sign-up/lib/schema"
import z from "zod"

export type SignUpFormOutput = z.infer<typeof signUpFormSchema>
