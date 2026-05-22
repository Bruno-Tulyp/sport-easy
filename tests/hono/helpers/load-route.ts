import { faker } from "@faker-js/faker"
import { vi } from "vitest"

type QueryTableMock = {
  findFirst?: ReturnType<typeof vi.fn>
  findMany?: ReturnType<typeof vi.fn>
}

type MockDbOptions = {
  insertRows?: unknown[]
  updateRows?: unknown[]
  query?: Partial<{
    matchParticipants: QueryTableMock
    matches: QueryTableMock
    teamInvitations: QueryTableMock
    teamMembers: QueryTableMock
    teams: QueryTableMock
    users: QueryTableMock
  }>
}

export const createMockDb = ({
  insertRows = [],
  updateRows = [],
  query = {},
}: MockDbOptions = {}) => {
  const insertChain = {
    returning: vi.fn().mockResolvedValue(insertRows),
    values: vi.fn(() => insertChain),
  }

  const updateChain = {
    returning: vi.fn().mockResolvedValue(updateRows),
    set: vi.fn(() => updateChain),
    where: vi.fn(() => updateChain),
  }

  const deleteChain = {
    where: vi.fn(),
  }

  const createTableMock = (overrides: QueryTableMock = {}) => ({
    findFirst: vi.fn().mockResolvedValue(null),
    findMany: vi.fn().mockResolvedValue([]),
    ...overrides,
  })

  const db = {
    insert: vi.fn(() => insertChain),
    update: vi.fn(() => updateChain),
    delete: vi.fn(() => deleteChain),
    query: {
      matchParticipants: createTableMock(query.matchParticipants),
      matches: createTableMock(query.matches),
      teamInvitations: createTableMock(query.teamInvitations),
      teamMembers: createTableMock(query.teamMembers),
      teams: createTableMock(query.teams),
      users: createTableMock(query.users),
    },
    transaction: vi.fn(async (callback: (tx: unknown) => unknown) =>
      callback(db),
    ),
  }

  return db
}

type LoadApiAppOptions = {
  db?: ReturnType<typeof createMockDb>
  session?: {
    user: {
      email: string
      id: string
      name: string
    }
  } | null
}

export const loadApiApp = async ({
  db = createMockDb(),
  session = {
    user: {
      email: faker.internet.email(),
      id: faker.string.uuid(),
      name: faker.person.fullName(),
    },
  },
}: LoadApiAppOptions = {}) => {
  vi.resetModules()

  const getSession = vi.fn().mockResolvedValue(session)

  const handler = vi.fn(() => new Response("auth-ok"))

  vi.doMock("@/db", () => ({ db }))

  vi.doMock("@/lib/auth", () => ({
    auth: {
      api: {
        getSession,
      },
      handler,
    },
  }))

  const { app } = await import("@/app/api/[[...route]]/route")

  return { app, db, getSession, handler }
}
