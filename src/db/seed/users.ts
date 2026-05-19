import { config } from "@/config"
import { authBodyGenerator, authGenerator } from "@/db/generator/auth"
import { faker } from "@faker-js/faker"

const seedUsers = async () => {
  const authBodies = [
    {
      email: config.seed.user.email,
      name: config.seed.user.name,
      password: config.seed.user.password,
    },
    ...faker.helpers.multiple(() => authBodyGenerator(), { count: 20 }),
  ]

  const authPromises = authBodies.map((authBody) => authGenerator(authBody))

  const users = await Promise.all(authPromises)

  return users.map(({ user: { id } }) => id)
}

export default seedUsers
