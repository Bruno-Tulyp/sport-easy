"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { webRoutes } from "@/lib/web-routes"
import { Calendar, House, LucideIcon, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items: { title: string; url: string; Icon: LucideIcon }[] = [
  { title: "Home", url: webRoutes.home, Icon: House },
  { title: "Matches", url: webRoutes.matches.index, Icon: Calendar },
  { title: "Teams", url: webRoutes.teams.index, Icon: Users },
]

const NavMain = () => {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(({ Icon, title, url }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton isActive={pathname === url} asChild>
                <Link href={url}>
                  <Icon className="size-4" />
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default NavMain
