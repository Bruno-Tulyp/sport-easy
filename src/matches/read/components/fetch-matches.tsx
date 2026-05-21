"use client"

import DataIsEmpty from "@/components/query/data-is-empty"
import ErrorInQuery from "@/components/query/error-in-query"
import { TypographyH2 } from "@/components/ui/typography"
import { matchRpcClient } from "@/hono/lib/rpc-client"
import useRpcQuery from "@/hooks/use-rpc-query"
import MatchCard from "@/matches/read/components/match-card"

const MainContent = ({
  teamSlug,
  futureContent,
  pastContent,
}: {
  teamSlug?: string
  futureContent: React.ReactNode
  pastContent: React.ReactNode
}) => (
  <div className="flex flex-col gap-4">
    <TypographyH2>
      {teamSlug ? "Future matches" : "Future matches for your teams"}
    </TypographyH2>
    <div className="flex flex-col gap-2">{futureContent}</div>
    <TypographyH2>
      {teamSlug ? "Past matches" : "Past matches for your teams"}
    </TypographyH2>
    <div className="flex flex-col gap-2">{pastContent}</div>
  </div>
)

const FetchMatches = ({ teamSlug }: { teamSlug?: string }) => {
  const { data, error, isError, isPending } = useRpcQuery(
    () => matchRpcClient.index.$get({ query: { teamSlug } }),
    { queryKey: ["matches"] },
  )

  if (isError) {
    return <ErrorInQuery scope="MATCHES" message={error.message} />
  }

  if (isPending) {
    const skeletons = Array.from({ length: 2 }).map((_, i) => (
      <MatchCard key={i} skeleton />
    ))

    return (
      <MainContent
        teamSlug={teamSlug}
        futureContent={skeletons}
        pastContent={skeletons}
      />
    )
  }

  const futureMatchesContent = data.futureMatches.length ? (
    data.futureMatches.map((match) => (
      <MatchCard key={match.slug} match={match} isFutureMatch />
    ))
  ) : (
    <DataIsEmpty description="No future matches found." />
  )

  const pastMatchesContent = data.pastMatches.length ? (
    data.pastMatches.map((match) => (
      <MatchCard key={match.slug} match={match} />
    ))
  ) : (
    <DataIsEmpty description="No past matches found." />
  )

  return (
    <MainContent
      teamSlug={teamSlug}
      futureContent={futureMatchesContent}
      pastContent={pastMatchesContent}
    />
  )
}

export default FetchMatches
