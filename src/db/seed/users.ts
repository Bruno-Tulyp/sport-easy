import { authBodyGenerator, authGenerator } from "@/db/generator/auth"
import { faker } from "@faker-js/faker"

const DEFAULT_PASSWORD = "Pa$$w0rd123"

const seedUsers = async () => {
  const authBodies = [
    {
      email: "bruno@tulyp.io",
      name: "Bruno",
      password: DEFAULT_PASSWORD,
    },
    {
      email: "john@tulyp.io",
      name: "John",
      password: DEFAULT_PASSWORD,
    },
    ...faker.helpers.multiple(() => authBodyGenerator(), { count: 20 }),
  ]

  const authPromises = authBodies.map((authBody) => authGenerator(authBody))

  const users = await Promise.all(authPromises)

  return users.map(({ user: { id } }) => id)
}

export default seedUsers
