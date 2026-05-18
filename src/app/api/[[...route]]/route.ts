import { auth } from "@/lib/auth"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { handle } from "hono/vercel"

const app = new Hono().basePath("/api")

app.use(logger())

app.get("/hello", (c) => c.json({ message: "Hello SportEasy!" }))

app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw))

export const GET = handle(app)
export const POST = handle(app)
