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

const configSchema = z.object({
  database: dbSchema,
})

export const config = configSchema.parse({
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
  },
})
