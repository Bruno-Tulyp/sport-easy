import { factory } from "@/hono/lib/factory"
import { auth } from "@/lib/auth"
import { logger } from "hono/logger"
import { handle } from "hono/vercel"

const app = factory.createApp().basePath("/api")

app.use(logger())

app.onError((error, { var: { fail } }) => {
  console.error("Unhandled error:", error)

  return fail(500, "Oops! Something went wrong.")
})

app.get("/hello", ({ var: { send } }) => send({ message: "Hello SportEasy!" }))

app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw))

export const GET = handle(app)
export const POST = handle(app)
