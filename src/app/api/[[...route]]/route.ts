import { factory } from "@/hono/lib/factory"
import { invitationRoutes } from "@/hono/routes/invitations"
import { matchRoutes } from "@/hono/routes/matches"
import { teamRoutes } from "@/hono/routes/teams"
import { auth } from "@/lib/auth"
import { logger } from "hono/logger"
import { handle } from "hono/vercel"

export const app = factory.createApp().basePath("/api")

app.use(logger())

app.onError((error, { var: { fail } }) => {
  console.error("Unhandled error:", error)

  return fail(500, "Oops! Something went wrong.")
})

app.get("/hello", ({ var: { send } }) => send({ message: "Hello SportEasy!" }))

app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw))

app
  .route("/teams", teamRoutes)
  .route("/invitations", invitationRoutes)
  .route("/matches", matchRoutes)

export const GET = handle(app)
export const POST = handle(app)
