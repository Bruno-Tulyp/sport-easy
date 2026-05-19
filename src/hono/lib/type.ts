import { fail, send } from "@/hono/lib/format"

export type HonoAppEnv = {
  Variables: {
    fail: ReturnType<typeof fail>
    send: ReturnType<typeof send>
  }
}
