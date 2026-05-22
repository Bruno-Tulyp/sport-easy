import { teamMemberPermissions, teamMemberRoles } from "@/teams/lib/schema"
import { faker } from "@faker-js/faker"
import { createMockDb, loadApiApp } from "@tests/hono/helpers/load-route"
import { describe, expect, it, vi } from "vitest"

const teamId = faker.string.uuid()
const teamLocation = faker.location.city()
const teamName = faker.company.name()
const teamSlug = faker.helpers.slugify(teamName)
const coachEmail = faker.internet.email()
const coachName = faker.person.fullName()

describe("team routes", () => {
  it("returns the current user's teams", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findMany: vi.fn().mockResolvedValue([
            {
              permission: teamMemberPermissions.enum.admin,
              role: teamMemberRoles.enum.coach,
              team: {
                location: teamLocation,
                name: teamName,
                slug: teamSlug,
              },
            },
          ]),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/teams")

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: [
        {
          permission: teamMemberPermissions.enum.admin,
          role: teamMemberRoles.enum.coach,
          team: {
            location: teamLocation,
            name: teamName,
            slug: teamSlug,
          },
        },
      ],
    })
  })

  it("returns team details when the user belongs to the team", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue({
            permission: teamMemberPermissions.enum.member,
          }),
          findMany: vi.fn().mockResolvedValue([
            {
              permission: teamMemberPermissions.enum.admin,
              role: teamMemberRoles.enum.coach,
              user: { email: coachEmail, name: coachName },
            },
          ]),
        },
        teams: {
          findFirst: vi.fn().mockResolvedValue({
            id: teamId,
            location: teamLocation,
            name: teamName,
            slug: teamSlug,
          }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(`/api/teams/${teamSlug}`)

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: {
        permission: teamMemberPermissions.enum.member,
        team: {
          id: teamId,
          location: teamLocation,
          name: teamName,
          slug: teamSlug,
        },
        members: [
          {
            permission: teamMemberPermissions.enum.admin,
            role: teamMemberRoles.enum.coach,
            user: { email: coachEmail, name: coachName },
          },
        ],
      },
    })
  })

  it("returns 404 when the team does not exist", async () => {
    const db = createMockDb({
      query: {
        teams: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/teams/missing-team")

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Team not found.",
      },
    })
  })

  it("returns 404 when the user does not belong to the team", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
        teams: {
          findFirst: vi.fn().mockResolvedValue({
            id: teamId,
            location: teamLocation,
            name: teamName,
            slug: teamSlug,
          }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(`/api/teams/${teamSlug}`)

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Team not found for the user.",
      },
    })
  })

  it("creates a team", async () => {
    const db = createMockDb({
      insertRows: [{ teamId }],
      query: {
        teams: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/teams", {
      body: JSON.stringify({
        team: { location: teamLocation, name: teamName },
        user: { role: teamMemberRoles.enum.coach },
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(201)

    expect(await response.json()).toEqual({
      success: true,
      data: { teamId },
    })
  })

  it("rejects duplicate team names", async () => {
    const db = createMockDb({
      query: {
        teams: {
          findFirst: vi.fn().mockResolvedValue({ id: teamId }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/teams", {
      body: JSON.stringify({
        team: { location: teamLocation, name: teamName },
        user: { role: teamMemberRoles.enum.coach },
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(400)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 400,
        message: "A team with the same name already exists.",
      },
    })
  })

  it("returns validation errors for malformed payloads", async () => {
    const { app } = await loadApiApp()

    const response = await app.request("/api/teams", {
      body: JSON.stringify({
        team: { name: "" },
        user: { role: teamMemberRoles.enum.coach },
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(400)

    expect(await response.json()).toMatchObject({
      success: false,
      error: {
        code: 400,
      },
    })
  })
})
