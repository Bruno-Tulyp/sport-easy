import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const ProtectedLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const data = await auth.api.getSession({
    headers: await headers(),
  })

  if (!data) {
    redirect("/login")
  }

  return children
}

export default ProtectedLayout
