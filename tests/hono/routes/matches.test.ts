import { matchReplies } from "@/matches/lib/schema"
import { teamMemberPermissions } from "@/teams/lib/schema"
import { faker } from "@faker-js/faker"
import { createMockDb, loadApiApp } from "@tests/hono/helpers/load-route"
import { describe, expect, it, vi } from "vitest"

const replyClosedStartDate = faker.date.past()
const matchTeamId = faker.string.uuid()
const teamLocation = faker.location.city()
const teamName = faker.company.name()
const teamSlug = faker.helpers.slugify(teamName)
const futureMatchLocation = faker.location.city()
const futureMatchOpponent = faker.company.name()
const futureMatchSlug = faker.helpers.slugify(
  `${teamName} vs ${futureMatchOpponent}`,
)
const pastMatchLocation = faker.location.city()
const pastMatchOpponent = faker.company.name()
const pastMatchSlug = faker.helpers.slugify(
  `${teamName} vs ${pastMatchOpponent}`,
)
const futureMatchStartDate = faker.date.future()
const futureMatchEndDate = faker.date.future({ refDate: futureMatchStartDate })
const futureMatchMeetingDate = faker.date.past({
  refDate: futureMatchStartDate,
})
const pastMatchStartDate = faker.date.past()
const participantUserId = faker.string.uuid()
const participantUserName = faker.person.fullName()
const matchDescription = faker.company.catchPhrase()
const matchId = faker.string.uuid()
const createdMatchId = faker.string.uuid()
const createdUserOneId = faker.string.uuid()
const createdUserTwoId = faker.string.uuid()

describe("match routes", () => {
  it("lists future and past matches for all member teams", async () => {
    const db = createMockDb({
      query: {
        matches: {
          findMany: vi
            .fn()
            .mockResolvedValueOnce([
              {
                location: futureMatchLocation,
                opponent: futureMatchOpponent,
                slug: futureMatchSlug,
                startDate: futureMatchStartDate.toISOString(),
                team: { name: teamName },
              },
            ])
            .mockResolvedValueOnce([
              {
                location: pastMatchLocation,
                opponent: pastMatchOpponent,
                slug: pastMatchSlug,
                startDate: pastMatchStartDate.toISOString(),
                team: { name: teamName },
              },
            ]),
        },
        teamMembers: {
          findMany: vi.fn().mockResolvedValue([{ teamId: matchTeamId }]),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/matches")

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: {
        futureMatches: [
          {
            location: futureMatchLocation,
            opponent: futureMatchOpponent,
            slug: futureMatchSlug,
            startDate: futureMatchStartDate.toISOString(),
            team: { name: teamName },
          },
        ],
        pastMatches: [
          {
            location: pastMatchLocation,
            opponent: pastMatchOpponent,
            slug: pastMatchSlug,
            startDate: pastMatchStartDate.toISOString(),
            team: { name: teamName },
          },
        ],
      },
    })
  })

  it("lists matches for a specific team when the user belongs to it", async () => {
    const db = createMockDb({
      query: {
        matches: {
          findMany: vi
            .fn()
            .mockResolvedValueOnce([
              {
                location: futureMatchLocation,
                opponent: futureMatchOpponent,
                slug: futureMatchSlug,
                startDate: futureMatchStartDate.toISOString(),
                team: { name: teamName },
              },
            ])
            .mockResolvedValueOnce([]),
        },
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue({
            permission: teamMemberPermissions.enum.member,
          }),
        },
        teams: {
          findFirst: vi.fn().mockResolvedValue({
            id: matchTeamId,
            location: teamLocation,
            name: teamName,
            slug: teamSlug,
          }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(`/api/matches?teamSlug=${teamSlug}`)

    expect(response.status).toBe(200)

    expect(await response.json()).toMatchObject({
      success: true,
      data: {
        futureMatches: [
          {
            location: futureMatchLocation,
            opponent: futureMatchOpponent,
            slug: futureMatchSlug,
            team: { name: teamName },
          },
        ],
        pastMatches: [],
      },
    })
  })

  it("returns 404 when the team in the query is unknown", async () => {
    const db = createMockDb({
      query: {
        teams: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/matches?teamSlug=missing-team")

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Team not found.",
      },
    })
  })

  it("returns 404 when the user does not belong to the requested team", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
        teams: {
          findFirst: vi.fn().mockResolvedValue({
            id: matchTeamId,
            location: teamLocation,
            name: teamName,
            slug: teamSlug,
          }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(`/api/matches?teamSlug=${teamSlug}`)

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Team not found for the user.",
      },
    })
  })

  it("returns a match with the user's participation status", async () => {
    const db = createMockDb({
      query: {
        matchParticipants: {
          findFirst: vi.fn().mockResolvedValue({
            reply: matchReplies.enum.awaiting,
          }),
          findMany: vi.fn().mockResolvedValue([
            {
              reply: matchReplies.enum.awaiting,
              user: { id: participantUserId, name: participantUserName },
            },
          ]),
        },
        matches: {
          findFirst: vi.fn().mockResolvedValue({
            description: matchDescription,
            endDate: futureMatchEndDate.toISOString(),
            id: matchId,
            location: futureMatchLocation,
            meetingDate: futureMatchMeetingDate.toISOString(),
            opponent: futureMatchOpponent,
            slug: futureMatchSlug,
            startDate: futureMatchStartDate.toISOString(),
            team: { name: teamName },
            teamId: matchTeamId,
          }),
        },
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue({ teamId: matchTeamId }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(`/api/matches/${futureMatchSlug}`)

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: {
        match: {
          description: matchDescription,
          endDate: futureMatchEndDate.toISOString(),
          location: futureMatchLocation,
          meetingDate: futureMatchMeetingDate.toISOString(),
          opponent: futureMatchOpponent,
          slug: futureMatchSlug,
          startDate: futureMatchStartDate.toISOString(),
          team: { name: teamName },
        },
        participants: [
          {
            reply: matchReplies.enum.awaiting,
            user: { id: participantUserId, name: participantUserName },
          },
        ],
        reply: matchReplies.enum.awaiting,
      },
    })
  })

  it("returns 404 when a match does not exist", async () => {
    const { app } = await loadApiApp()

    const response = await app.request("/api/matches/missing-match")

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Match not found.",
      },
    })
  })

  it("returns 404 when the user is not a team member for the match", async () => {
    const db = createMockDb({
      query: {
        matches: {
          findFirst: vi.fn().mockResolvedValue({
            description: matchDescription,
            endDate: futureMatchEndDate.toISOString(),
            id: matchId,
            location: futureMatchLocation,
            meetingDate: futureMatchMeetingDate.toISOString(),
            opponent: futureMatchOpponent,
            slug: futureMatchSlug,
            startDate: futureMatchStartDate.toISOString(),
            team: { name: teamName },
            teamId: matchTeamId,
          }),
        },
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(`/api/matches/${futureMatchSlug}`)

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Match not found for the user.",
      },
    })
  })

  it("stores a match reply", async () => {
    const db = createMockDb({
      updateRows: [{ reply: matchReplies.enum.accepted }],
      query: {
        matches: {
          findFirst: vi.fn().mockResolvedValue({
            id: matchId,
            startDate: futureMatchStartDate.toISOString(),
          }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(
      `/api/matches/${futureMatchSlug}/accepted`,
      { method: "POST" },
    )

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: null,
    })
  })

  it("rejects replies for matches that have already started", async () => {
    const db = createMockDb({
      query: {
        matches: {
          findFirst: vi.fn().mockResolvedValue({
            id: matchId,
            startDate: replyClosedStartDate,
          }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(
      `/api/matches/${futureMatchSlug}/accepted`,
      { method: "POST" },
    )

    expect(response.status).toBe(400)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 400,
        message: "Match has already started.",
      },
    })
  })

  it("returns 404 when the match participation does not exist", async () => {
    const db = createMockDb({
      updateRows: [],
      query: {
        matches: {
          findFirst: vi.fn().mockResolvedValue({
            id: matchId,
            startDate: futureMatchStartDate.toISOString(),
          }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(
      `/api/matches/${futureMatchSlug}/accepted`,
      { method: "POST" },
    )

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Match participation not found.",
      },
    })
  })

  it("rejects match creation when the user is not an admin", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/matches", {
      body: JSON.stringify({
        description: matchDescription,
        endDate: futureMatchEndDate.toISOString(),
        location: futureMatchLocation,
        meetingDate: futureMatchMeetingDate.toISOString(),
        opponent: futureMatchOpponent,
        startDate: futureMatchStartDate.toISOString(),
        teamId: matchTeamId,
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(403)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 403,
        message: "You must be a team admin to create a match.",
      },
    })
  })

  it("returns 404 when creating a match for a missing team", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue({
            permission: teamMemberPermissions.enum.admin,
          }),
        },
        teams: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/matches", {
      body: JSON.stringify({
        description: matchDescription,
        endDate: futureMatchEndDate.toISOString(),
        location: futureMatchLocation,
        meetingDate: futureMatchMeetingDate.toISOString(),
        opponent: futureMatchOpponent,
        startDate: futureMatchStartDate.toISOString(),
        teamId: matchTeamId,
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Team not found.",
      },
    })
  })

  it("creates a match and initializes participant replies", async () => {
    const db = createMockDb({
      insertRows: [{ matchId: createdMatchId }],
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue({
            permission: teamMemberPermissions.enum.admin,
          }),
        },
        teams: {
          findFirst: vi.fn().mockResolvedValue({
            id: matchTeamId,
            slug: teamSlug,
            members: [
              { userId: createdUserOneId },
              { userId: createdUserTwoId },
            ],
          }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/matches", {
      body: JSON.stringify({
        description: matchDescription,
        endDate: futureMatchEndDate.toISOString(),
        location: futureMatchLocation,
        meetingDate: futureMatchMeetingDate.toISOString(),
        opponent: futureMatchOpponent,
        startDate: futureMatchStartDate.toISOString(),
        teamId: matchTeamId,
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(201)

    expect(await response.json()).toEqual({
      success: true,
      data: { matchId: createdMatchId },
    })
  })
})
