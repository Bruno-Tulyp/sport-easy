import { HonoAppEnv } from "@/hono/lib/type"
import { auth } from "@/lib/auth"
import { createMiddleware } from "hono/factory"

type UserSession = (typeof auth.$Infer.Session)["user"]

export const authMiddleware = createMiddleware<
  HonoAppEnv & {
    Variables: {
      user: UserSession
    }
  }
>(async ({ req, set, var: { fail } }, next) => {
  const session = await auth.api.getSession({ headers: req.raw.headers })

  if (!session) {
    return fail(401, "You must be authenticated to access this resource!")
  }

  set("user", session.user)

  await next()
})
