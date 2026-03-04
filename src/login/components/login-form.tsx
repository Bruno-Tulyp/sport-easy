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
import { loginFormSchema } from "@/login/lib/schema"
import { LoginFormOutput } from "@/login/lib/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values: LoginFormOutput) =>
      authClient.signIn.email({ ...values, callbackURL: "/" }),
    onSuccess: ({ error }) => {
      if (error) toast.error(error.message)
    },
    onError: () => toast.error("Something went wrong. Please try again later."),
  })

  const onSubmit = (values: LoginFormOutput) => mutate(values)

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Please log in with your credentials to access the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
              autoComplete="current-password"
            />
            <Field>
              <SubmitButton isPending={isPending}>Log in</SubmitButton>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default LoginForm
