import { DbClient } from "@/db/lib/type"
import { fail, send } from "@/hono/lib/format"

export type HonoAppEnv = {
  Variables: {
    db: DbClient
    fail: ReturnType<typeof fail>
    send: ReturnType<typeof send>
  }
}
