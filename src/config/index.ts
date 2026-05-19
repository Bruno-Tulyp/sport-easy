import z from "zod"

const dbSchema = z
  .object({
    user: z.string(),
    password: z.string(),
    host: z.string(),
    port: z.coerce.number(),
    dbName: z.string(),
  })
  .transform(({ user, password, host, port, dbName }) => ({
    connectionString: `postgresql://${user}:${password}@${host}:${port}/${dbName}`,
  }))

const seedSchema = z.object({
  user: z.object({
    email: z.email(),
    name: z.string(),
    password: z.string(),
  }),
})

const configSchema = z.object({
  database: dbSchema,
  seed: seedSchema,
})

export const config = configSchema.parse({
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
  },
  seed: {
    user: {
      email: process.env.SEED_USER_EMAIL,
      name: process.env.SEED_USER_NAME,
      password: process.env.SEED_USER_PASSWORD,
    },
  },
})
