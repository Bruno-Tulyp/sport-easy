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
import { webRoutes } from "@/lib/web-routes"
import { TeamMemberPermissions, TeamMemberRoles } from "@/teams/lib/type"
import { EyeIcon, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

type Props =
  | {
      skeleton?: never
      data: {
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
      data?: never
    }

const TeamCard = ({ skeleton, data }: Props) => {
  const router = useRouter()

  if (skeleton) {
    return <Skeleton className="h-40" />
  }

  const {
    permission,
    role,
    team: { location, name, slug },
  } = data

  const handleClick = () => router.push(webRoutes.teams.details(slug))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{`${name} (#${slug})`}</CardTitle>
        <CardDescription className="flex gap-x-1.5 items-center">
          <MapPin className="size-4" />
          {location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{`Your role in the team is ${role} and you have ${permission} permissions`}</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" onClick={handleClick}>
          <EyeIcon />
          View team details
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TeamCard
