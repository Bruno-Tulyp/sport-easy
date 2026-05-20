import { HonoAppEnv } from "@/hono/lib/type"
import { Hook } from "@hono/zod-validator"
import { Context, Env } from "hono"
import z from "zod"

export const zValidatorError: Hook<unknown, Env, string> = (res, c) => {
  const {
    var: { fail },
  } = c as Context<HonoAppEnv>

  if (!res.success) {
    return fail(400, z.prettifyError(res.error))
  }
}
