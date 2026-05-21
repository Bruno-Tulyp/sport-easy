import { ApiErrorResponse, ApiSuccessResponse } from "@/hono/lib/type"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import type { ClientResponse, InferResponseType } from "hono/client"

type ApiResponse<T> = ApiErrorResponse | ApiSuccessResponse<T>

type RpcRequest = () => Promise<
  ClientResponse<ApiResponse<unknown>, number, "json">
>

type InferData<R extends RpcRequest> = Extract<
  InferResponseType<R>,
  { success: true }
>["data"]

const useRpcQuery = <
  R extends RpcRequest,
  TData = InferData<R>,
  TQueryKey extends QueryKey = QueryKey,
>(
  request: R,
  options: Omit<
    UseQueryOptions<InferData<R>, Error, TData, TQueryKey>,
    "queryFn"
  >,
) =>
  useQuery({
    ...options,
    queryFn: async () => {
      const res = await request()

      const body = await res.json()

      if (!body.success) {
        throw new Error(`[${body.error.code}] ${body.error.message}`)
      }

      return body.data as InferData<R>
    },
  })

export default useRpcQuery
