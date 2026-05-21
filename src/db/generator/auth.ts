import { config } from "@/config"
import { auth } from "@/lib/auth"
import { faker } from "@faker-js/faker"

type Body = {
  email: string
  name: string
  password: string
}

export const authBodyGenerator = (): Body => ({
  email: faker.internet.email(),
  name: faker.person.firstName(),
  password: config.seed.user.password,
})

export const authGenerator = async (body: Body) =>
  auth.api.signUpEmail({ body })
