import { Context } from "hono"
import {
  ClientErrorStatusCode,
  ContentlessStatusCode,
  ServerErrorStatusCode,
  SuccessStatusCode,
} from "hono/utils/http-status"

export const fail =
  (c: Context) =>
  (
    errorCode: Exclude<
      ClientErrorStatusCode | ServerErrorStatusCode,
      ContentlessStatusCode
    >,
    message: string,
  ) =>
    c.json(
      {
        success: false,
        error: { code: errorCode, message },
      },
      errorCode,
    )

export const send =
  (c: Context) =>
  <T>(
    data: T,
    statusCode?: Exclude<SuccessStatusCode, ContentlessStatusCode>,
  ) =>
    c.json({ success: true, data }, statusCode ?? 200)
