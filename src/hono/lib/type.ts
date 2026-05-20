import { DbClient } from "@/db/lib/type"
import { fail, send } from "@/hono/lib/format"
import {
  ClientErrorStatusCode,
  ContentlessStatusCode,
  ServerErrorStatusCode,
  SuccessStatusCode,
} from "hono/utils/http-status"

export type HonoAppEnv = {
  Variables: {
    db: DbClient
    fail: ReturnType<typeof fail>
    send: ReturnType<typeof send>
  }
}

export type ApiErrorCode = Exclude<
  ClientErrorStatusCode | ServerErrorStatusCode,
  ContentlessStatusCode
>

export type ApiErrorResponse = {
  success: false
  error: {
    code: ApiErrorCode
    message: string
  }
}

export type ApiSuccessCode = Exclude<SuccessStatusCode, ContentlessStatusCode>

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
