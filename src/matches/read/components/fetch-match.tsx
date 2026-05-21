"use client"

import ErrorInQuery from "@/components/query/error-in-query"
import { matchRpcClient } from "@/hono/lib/rpc-client"
import useRpcQuery from "@/hooks/use-rpc-query"
import MatchDetailsCard from "@/matches/read/components/match-details-card"

const FetchMatch = ({ matchSlug }: { matchSlug: string }) => {
  const { data, error, isError, isPending } = useRpcQuery(
    () => matchRpcClient[":matchSlug"].$get({ param: { matchSlug } }),
    { queryKey: ["matches", matchSlug] },
  )

  if (isError) {
    return <ErrorInQuery scope="MATCHES" message={error.message} />
  }

  if (isPending) {
    return <MatchDetailsCard skeleton />
  }

  return <MatchDetailsCard {...data} />
}

export default FetchMatch
