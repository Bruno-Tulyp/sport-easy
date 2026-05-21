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
import { formatISODate } from "@/lib/utils"
import { webRoutes } from "@/lib/web-routes"
import { EyeIcon } from "lucide-react"
import { useRouter } from "next/navigation"

type Props =
  | {
      skeleton?: never
      isFutureMatch?: boolean
      match: {
        slug: string
        location: string
        opponent: string
        startDate: string
        team: {
          name: string
        }
      }
    }
  | {
      skeleton: true
      isFutureMatch?: never
      match?: never
    }

const MatchCard = ({ isFutureMatch, match, skeleton }: Props) => {
  const router = useRouter()

  if (skeleton) {
    return <Skeleton className="h-40" />
  }

  const {
    location,
    opponent,
    slug,
    startDate,
    team: { name },
  } = match

  const handleClick = () => router.push(webRoutes.matches.details(slug))

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>{`${name.toUpperCase()} // ${opponent.toUpperCase()}`}</CardTitle>
        <CardDescription>{formatISODate(startDate)}</CardDescription>
      </CardHeader>
      {isFutureMatch && (
        <CardContent>
          <p>{`Your team will play against ${opponent} at ${location}`}</p>
        </CardContent>
      )}
      <CardFooter>
        <Button size="sm" onClick={handleClick}>
          <EyeIcon />
          View match details
        </Button>
      </CardFooter>
    </Card>
  )
}

export default MatchCard
