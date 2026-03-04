"use client"

import FormFieldInput from "@/components/form/form-field-input"
import SubmitButton from "@/components/form/submit-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { authClient } from "@/lib/auth-client"
import { signUpFormSchema } from "@/sign-up/lib/schema"
import { SignUpFormOutput } from "@/sign-up/lib/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const SignUpForm = () => {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SignUpFormOutput) => authClient.signUp.email(values),
    onSuccess: ({ error }) => {
      if (error) toast.error(error.message)
      else router.push("/login")
    },
    onError: () => toast.error("Something went wrong. Please try again later."),
  })

  const onSubmit = (values: SignUpFormOutput) => mutate(values)

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Please fill in the form below to create a new account and access the
          application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormFieldInput
              control={form.control}
              name="name"
              label="Name"
              placeholder="John Doe"
              autoComplete="name"
            />
            <FormFieldInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
            />
            <FormFieldInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
            />
            <Field>
              <SubmitButton isPending={isPending}>Sign Up</SubmitButton>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Log in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default SignUpForm
