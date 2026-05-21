import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TeamMemberPermissions, TeamMemberRoles } from "@/teams/lib/type"
import { CheckIcon, InfoIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

type Props =
  | {
      skeleton?: never
      invitation: {
        id: string
        permission: TeamMemberPermissions
        role: TeamMemberRoles
        team: {
          name: string
          slug: string
          location: string
        }
      }
    }
  | {
      skeleton: true
      invitation?: never
    }

const InvitationAlert = ({ skeleton, invitation }: Props) => {
  if (skeleton) {
    return <Skeleton className="h-32" />
  }

  const {
    id,
    permission,
    role,
    team: { location, name, slug },
  } = invitation

  const handleAction = (action: "accept" | "decline") => () =>
    toast(`${action}: ${id}`)

  return (
    <Alert>
      <InfoIcon />
      <AlertTitle>{`Invitation to join ${name} (#${slug})`}</AlertTitle>
      <AlertDescription>
        {`You have been invited to join the team ${name} located in ${location} with the role of '${role}' and permissions of '${permission}'.`}
      </AlertDescription>
      <div className="flex flex-wrap gap-1 col-start-2 mt-1">
        <Button size="xs" onClick={handleAction("accept")}>
          <CheckIcon />
          Accept
        </Button>
        <Button size="xs" variant="outline" onClick={handleAction("decline")}>
          <XIcon />
          Decline
        </Button>
      </div>
    </Alert>
  )
}

export default InvitationAlert
