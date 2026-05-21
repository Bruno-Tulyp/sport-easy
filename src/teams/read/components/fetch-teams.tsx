"use client"

import DataIsEmpty from "@/components/query/data-is-empty"
import ErrorInQuery from "@/components/query/error-in-query"
import { TypographyH2 } from "@/components/ui/typography"
import { teamRpcClient } from "@/hono/lib/rpc-client"
import useRpcQuery from "@/hooks/use-rpc-query"
import TeamCard from "@/teams/read/components/team-card"

const MainContent = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-4">
    <TypographyH2>Your teams</TypographyH2>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
)

const FetchTeams = () => {
  const { data, error, isError, isPending } = useRpcQuery(
    teamRpcClient.index.$get,
    { queryKey: ["teams"] },
  )

  if (isError) {
    return <ErrorInQuery scope="TEAMS" message={error.message} />
  }

  if (isPending) {
    return (
      <MainContent>
        {Array.from({ length: 2 }).map((_, i) => (
          <TeamCard key={i} skeleton />
        ))}
      </MainContent>
    )
  }

  return (
    <MainContent>
      {data.length === 0 ? (
        <DataIsEmpty description="You are not part of any team yet." />
      ) : (
        data.map((team) => <TeamCard key={team.team.slug} data={team} />)
      )}
    </MainContent>
  )
}

export default FetchTeams
