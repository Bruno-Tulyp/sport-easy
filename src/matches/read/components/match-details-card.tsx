import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatISODate } from "@/lib/utils"
import { MatchReplies } from "@/matches/lib/type"
import { CheckIcon, InfoIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

type Props =
  | {
      skeleton?: never
      match: {
        description: string | null
        slug: string
        location: string
        opponent: string
        meetingDate: string
        startDate: string
        endDate: string
        team: {
          name: string
        }
      }
      participants: {
        reply: MatchReplies
        user: {
          id: string
          name: string
        }
      }[]
      reply: MatchReplies | null
    }
  | {
      skeleton: true
      match?: never
      participants?: never
      reply?: never
    }

const MatchDetailsCard = ({ match, participants, reply, skeleton }: Props) => {
  if (skeleton) {
    return (
      <>
        <Skeleton className="h-56" />
        <Skeleton className="h-96" />
      </>
    )
  }

  const {
    description,
    endDate,
    location,
    opponent,
    meetingDate,
    startDate,
    team,
    slug,
  } = match

  const canReply = startDate > new Date().toISOString() && reply

  const handleReply = (action: "accept" | "decline") => () =>
    toast(`${action}: ${slug}`)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{`${team.name.toUpperCase()} // ${opponent.toUpperCase()}`}</CardTitle>
          {
            <CardDescription>
              {description ?? "No description available."}
            </CardDescription>
          }
        </CardHeader>
        <CardContent>
          <p>• Meeting date: {formatISODate(meetingDate)}</p>
          <p>• Start date: {formatISODate(startDate)}</p>
          <p>• End date: {formatISODate(endDate)}</p>
          <br />
          <p>• Location: {location}</p>
          <br />
        </CardContent>
      </Card>
      {canReply && (
        <Alert>
          <InfoIcon />
          <AlertTitle>{`Your current reply status: ${reply.toUpperCase()}`}</AlertTitle>
          <AlertDescription>
            You can still change your answer by clicking on the button below.
          </AlertDescription>
          <div className="flex flex-wrap gap-1 col-start-2 mt-1">
            {reply !== "accepted" && (
              <Button size="xs" onClick={handleReply("accept")}>
                <CheckIcon />
                Accept
              </Button>
            )}
            {reply !== "declined" && (
              <Button
                variant="destructive"
                size="xs"
                onClick={handleReply("decline")}
              >
                <XIcon />
                Decline
              </Button>
            )}
          </div>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>
            A list of participants and their replies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Reply</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map(({ user, reply }) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reply === "accepted"
                          ? "default"
                          : reply === "awaiting"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {reply.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

export default MatchDetailsCard
