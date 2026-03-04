"use client"

import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const Providers = ({ children }: React.PropsWithChildren) => (
  <>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    <Toaster />
  </>
)

export default Providers
