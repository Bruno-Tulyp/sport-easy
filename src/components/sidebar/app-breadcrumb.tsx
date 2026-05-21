"use client"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { webRoutes } from "@/lib/web-routes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const AppBreadcrumb = () => {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)
  const truncateSegments = segments.length > 2
  const displayedSegments = truncateSegments ? segments.slice(-2) : segments

  const breadcrumbs = displayedSegments.map((segment, index) => {
    const href =
      "/" +
      segments
        .slice(0, segments.length - displayedSegments.length + index + 1)
        .join("/")

    const label = segment.replaceAll("-", " ")

    return { href, label }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={webRoutes.home}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {truncateSegments && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </>
        )}
        {breadcrumbs.map(({ href, label }, index) => (
          <React.Fragment key={href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href} className="capitalize">
                    {label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default AppBreadcrumb
