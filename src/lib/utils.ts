import { faker } from "@faker-js/faker"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const slugify = (text: string) =>
  faker.helpers.slugify(text).toLowerCase()
