import { faker } from "@faker-js/faker"

export const slugifyMatch = (teamSlug: string) =>
  `match-${teamSlug}-${faker.string.alphanumeric(10)}`
