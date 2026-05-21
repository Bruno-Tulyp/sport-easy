import FetchInvitations from "@/invitations/read/components/fetch-invitations"
import FetchMatches from "@/matches/read/components/fetch-matches"
import FetchTeams from "@/teams/read/components/fetch-teams"

const Page = () => (
  <>
    <FetchInvitations />
    <FetchTeams />
    <FetchMatches />
  </>
)

export default Page
