import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { TeamMemberPermissions, TeamMemberRoles } from "@/teams/lib/type"
import { MapPin, UsersIcon } from "lucide-react"
import { toast } from "sonner"

type Props =
  | {
      skeleton?: never
      team: {
        name: string
        id: string
        slug: string
        location: string
      }
      members: {
        permission: TeamMemberPermissions
        role: TeamMemberRoles
        user: {
          email: string
          name: string
        }
      }[]
      permission: TeamMemberPermissions
    }
  | {
      skeleton: true
      team?: never
      members?: never
      permission?: never
    }

const TeamDetailsCard = ({ members, permission, skeleton, team }: Props) => {
  if (skeleton) {
    return (
      <>
        <Skeleton className="h-56" />
        <Skeleton className="h-96" />
      </>
    )
  }

  const { id, location, name, slug } = team

  const handleAddMember = () => {
    if (permission !== "admin") return

    toast(`Send invitation for team: ${id}`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{`${name} (#${slug})`}</CardTitle>
          <CardDescription className="flex gap-x-1.5 items-center">
            <MapPin className="size-4" />
            {location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{`This team as a total of ${members.length} member(s).`}</p>
        </CardContent>
        {permission === "admin" && (
          <CardFooter>
            <Button size="sm" onClick={handleAddMember}>
              <UsersIcon />
              Add a new member
            </Button>
          </CardFooter>
        )}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            List of all team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.user.email}>
                  <TableCell>{member.user.name}</TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.permission === "admin" ? "default" : "secondary"
                      }
                    >
                      {member.permission.toUpperCase()}
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

export default TeamDetailsCard
