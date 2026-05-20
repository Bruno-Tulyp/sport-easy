import { config } from "@/config/web"
import { invitationRoutes } from "@/hono/routes/invitations"
import { matchRoutes } from "@/hono/routes/matches"
import { teamRoutes } from "@/hono/routes/teams"
import { hc } from "hono/client"

const getBaseUrl = (ressource: string) => `${config.apiUrl}/${ressource}`

export const invitationRpcClient = hc<typeof invitationRoutes>(
  getBaseUrl("invitations"),
)

export const matchRpcClient = hc<typeof matchRoutes>(getBaseUrl("matches"))

export const teamRpcClient = hc<typeof teamRoutes>(getBaseUrl("teams"))
