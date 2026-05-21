"use client"

import ErrorInQuery from "@/components/query/error-in-query"
import { invitationRpcClient } from "@/hono/lib/rpc-client"
import useRpcQuery from "@/hooks/use-rpc-query"
import InvitationAlert from "@/invitations/read/components/invitation-alert"

const MainContent = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{children}</div>
)

const FetchInvitations = () => {
  const { data, error, isError, isPending } = useRpcQuery(
    invitationRpcClient.index.$get,
    { queryKey: ["invitations"] },
  )

  if (isError) {
    return <ErrorInQuery scope="INVITATIONS" message={error.message} />
  }

  if (isPending) {
    return (
      <MainContent>
        {Array.from({ length: 3 }).map((_, i) => (
          <InvitationAlert key={i} skeleton />
        ))}
      </MainContent>
    )
  }

  return data.length === 0 ? null : (
    <MainContent>
      {data.map((invitation) => (
        <InvitationAlert key={invitation.id} invitation={invitation} />
      ))}
    </MainContent>
  )
}

export default FetchInvitations
