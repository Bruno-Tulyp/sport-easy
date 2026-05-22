import { loadApiApp } from "@tests/hono/helpers/load-route"
import { describe, expect, it } from "vitest"

describe("API app", () => {
  it("serves the hello endpoint", async () => {
    const { app } = await loadApiApp()

    const response = await app.request("/api/hello")

    expect(response.status).toBe(200)

    expect(await response.json()).toEqual({
      success: true,
      data: { message: "Hello SportEasy!" },
    })
  })

  it("rejects unauthenticated requests", async () => {
    const { app } = await loadApiApp({ session: null })

    const response = await app.request("/api/teams")

    expect(response.status).toBe(401)

    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: 401,
        message: "You must be authenticated to access this resource!",
      },
    })
  })
})
