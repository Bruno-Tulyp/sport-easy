"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import { ChevronsUpDown, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const DisplayUserInfo = ({ name, email }: { name: string; email: string }) => {
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left leading-tight">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </>
  )
}

const NavUser = ({ name, email }: { name: string; email: string }) => {
  const router = useRouter()

  const { isMobile } = useSidebar()

  const { mutate, isPending } = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: ({ error }) => {
      if (error) toast.error(error.message)
      else router.push("/login")
    },
    onError: () => toast.error("Something went wrong. Please try again later."),
  })

  const handleSignOut = () => mutate()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <DisplayUserInfo name={name} email={email} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <DisplayUserInfo name={name} email={email} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleSignOut}
              disabled={isPending}
              aria-disabled={isPending}
              className="w-full"
              asChild
            >
              <button>
                <LogOut />
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavUser
