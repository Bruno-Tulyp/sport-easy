import { faker } from "@faker-js/faker"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const slugify = (text: string) =>
  faker.helpers.slugify(text).toLowerCase()

export const deslugify = (text: string) => {
  if (!text.includes("-")) {
    return text
  }

  const slugSegments = text.split("-")

  if (text.startsWith("match-")) {
    return slugSegments.slice(0, -1).join(" ")
  }

  return slugSegments.join(" ")
}

export const formatISODate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(isoDate))
