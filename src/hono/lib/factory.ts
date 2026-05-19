import { fail, send } from "@/hono/lib/format"
import { HonoAppEnv } from "@/hono/lib/type"
import { createFactory } from "hono/factory"

export const factory = createFactory<HonoAppEnv>({
  initApp: (app) => {
    app.use(async (c, next) => {
      c.set("fail", fail(c))
      c.set("send", send(c))

      await next()
    })
  },
})
