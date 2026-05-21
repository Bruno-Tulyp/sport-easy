export const webRoutes = {
  home: "/",
  matches: {
    index: "/matches",
    details: (slug: string) => `/matches/${slug}`,
  },
  teams: {
    index: "/teams",
    details: (slug: string) => `/teams/${slug}`,
  },
  login: "/login",
  signUp: "/sign-up",
}
