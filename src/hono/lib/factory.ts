import { fail, send } from "@/hono/lib/format"
import { createFactory } from "hono/factory"

export const factory = createFactory<{
  Variables: {
    fail: ReturnType<typeof fail>
    send: ReturnType<typeof send>
  }
}>({
  initApp: (app) => {
    app.use(async (c, next) => {
      c.set("fail", fail(c))
      c.set("send", send(c))

      await next()
    })
  },
})
