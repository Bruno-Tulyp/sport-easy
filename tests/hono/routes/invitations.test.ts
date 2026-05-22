import { teamMemberPermissions, teamMemberRoles } from "@/teams/lib/schema"
import { faker } from "@faker-js/faker"
import { createMockDb, loadApiApp } from "@tests/hono/helpers/load-route"
import { describe, expect, it, vi } from "vitest"

const invitationId = faker.string.uuid()
const teamId = faker.string.uuid()
const teamLocation = faker.location.city()
const teamName = faker.company.name()
const teamSlug = faker.helpers.slugify(teamName)
const playerEmail = faker.internet.email()
const memberEmail = faker.internet.email()
const memberUserId = faker.string.uuid()

describe("invitation routes", () => {
  it("lists invitations for the current user", async () => {
    const db = createMockDb({
      query: {
        teamInvitations: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: invitationId,
              permission: teamMemberPermissions.enum.member,
              role: teamMemberRoles.enum.player,
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

    const response = await app.request("/api/invitations")

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: [
        {
          id: invitationId,
          permission: teamMemberPermissions.enum.member,
          role: teamMemberRoles.enum.player,
          team: {
            location: teamLocation,
            name: teamName,
            slug: teamSlug,
          },
        },
      ],
    })
  })

  it("accepts an invitation", async () => {
    const db = createMockDb({
      query: {
        teamInvitations: {
          findFirst: vi
            .fn()
            .mockResolvedValueOnce({
              permission: teamMemberPermissions.enum.member,
              role: teamMemberRoles.enum.player,
              teamId,
            })
            .mockResolvedValueOnce(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(
      `/api/invitations/${invitationId}/accept`,
      { method: "POST" },
    )

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: null,
    })
  })

  it("returns 404 when accepting a missing invitation", async () => {
    const { app } = await loadApiApp()

    const response = await app.request(
      `/api/invitations/${invitationId}/accept`,
      { method: "POST" },
    )

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Invitation not found.",
      },
    })
  })

  it("declines an invitation", async () => {
    const db = createMockDb({
      query: {
        teamInvitations: {
          findFirst: vi.fn().mockResolvedValue({ id: invitationId }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request(
      `/api/invitations/${invitationId}/decline`,
      { method: "POST" },
    )

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: null,
    })
  })

  it("returns 404 when declining a missing invitation", async () => {
    const { app } = await loadApiApp()

    const response = await app.request(
      `/api/invitations/${invitationId}/decline`,
      { method: "POST" },
    )

    expect(response.status).toBe(404)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 404,
        message: "Invitation not found.",
      },
    })
  })

  it("rejects invitations from non-admin users", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/invitations", {
      body: JSON.stringify({
        email: playerEmail,
        permission: teamMemberPermissions.enum.member,
        role: teamMemberRoles.enum.player,
        teamId,
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(403)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 403,
        message: "You must be a team admin to invite others.",
      },
    })
  })

  it("rejects invitations for existing team members", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findFirst: vi
            .fn()
            .mockResolvedValueOnce({
              permission: teamMemberPermissions.enum.admin,
            })
            .mockResolvedValueOnce({ userId: memberUserId }),
        },
        users: {
          findFirst: vi.fn().mockResolvedValue({ id: memberUserId }),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/invitations", {
      body: JSON.stringify({
        email: memberEmail,
        permission: teamMemberPermissions.enum.member,
        role: teamMemberRoles.enum.player,
        teamId,
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(409)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 409,
        message: "This user is already a member of the team.",
      },
    })
  })

  it("rejects duplicate invitations", async () => {
    const db = createMockDb({
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue({
            permission: teamMemberPermissions.enum.admin,
          }),
        },
        teamInvitations: {
          findFirst: vi.fn().mockResolvedValue({ id: invitationId }),
        },
        users: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/invitations", {
      body: JSON.stringify({
        email: playerEmail,
        permission: teamMemberPermissions.enum.member,
        role: teamMemberRoles.enum.player,
        teamId,
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(409)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 409,
        message: "An invitation has already been sent to this email.",
      },
    })
  })

  it("creates an invitation", async () => {
    const db = createMockDb({
      insertRows: [{ invitationId }],
      query: {
        teamMembers: {
          findFirst: vi.fn().mockResolvedValue({
            permission: teamMemberPermissions.enum.admin,
          }),
        },
        teamInvitations: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
        users: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    })

    const { app } = await loadApiApp({ db })

    const response = await app.request("/api/invitations", {
      body: JSON.stringify({
        email: playerEmail,
        permission: teamMemberPermissions.enum.member,
        role: teamMemberRoles.enum.player,
        teamId,
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
      method: "POST",
    })

    expect(response.status).toBe(201)

    expect(await response.json()).toEqual({
      success: true,
      data: { invitationId },
    })
  })
})
