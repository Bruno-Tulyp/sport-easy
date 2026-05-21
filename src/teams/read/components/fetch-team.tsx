"use client"

import ErrorInQuery from "@/components/query/error-in-query"
import { teamRpcClient } from "@/hono/lib/rpc-client"
import useRpcQuery from "@/hooks/use-rpc-query"
import TeamDetailsCard from "@/teams/read/components/team-details-card"

const FetchTeam = ({ teamSlug }: { teamSlug: string }) => {
  const { data, error, isError, isPending } = useRpcQuery(
    () => teamRpcClient[":teamSlug"].$get({ param: { teamSlug } }),
    { queryKey: ["teams", teamSlug] },
  )

  if (isError) {
    return <ErrorInQuery scope="TEAMS" message={error.message} />
  }

  if (isPending) {
    return <TeamDetailsCard skeleton />
  }

  return <TeamDetailsCard {...data} />
}

export default FetchTeam
