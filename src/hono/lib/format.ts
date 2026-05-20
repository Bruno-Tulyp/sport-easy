import {
  ApiErrorCode,
  ApiErrorResponse,
  ApiSuccessCode,
  ApiSuccessResponse,
} from "@/hono/lib/type"
import { Context } from "hono"

export const fail =
  (c: Context) => (errorCode: ApiErrorCode, message: string) =>
    c.json(
      {
        success: false,
        error: { code: errorCode, message },
      } satisfies ApiErrorResponse,
      errorCode,
    )

export const send =
  (c: Context) =>
  <T>(data: T, successCode?: ApiSuccessCode) =>
    c.json(
      { success: true, data } satisfies ApiSuccessResponse<T>,
      successCode ?? 200,
    )
