import { HonoAppEnv } from "@/hono/lib/type"
import { Hook } from "@hono/zod-validator"
import { Context, Env } from "hono"
import z from "zod"

export const zValidatorError = ((res, c) => {
  const {
    var: { fail },
  } = c as Context<HonoAppEnv>

  if (!res.success) {
    return fail(400, z.prettifyError(res.error))
  }
}) satisfies Hook<unknown, Env, string>
