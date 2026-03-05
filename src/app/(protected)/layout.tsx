import AppBreadcrumb from "@/components/sidebar/app-breadcrumb"
import AppSidebar from "@/components/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
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

  const {
    user: { name, email },
  } = data

  return (
    <SidebarProvider>
      <AppSidebar name={name} email={email} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <AppBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default ProtectedLayout
