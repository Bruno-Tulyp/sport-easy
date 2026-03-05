import { Skeleton } from "@/components/ui/skeleton"
import { faker } from "@faker-js/faker"

const Page = () =>
  faker.helpers.multiple(
    (_, index) => (
      <div className="grid grid-cols-1 gap-4" key={index}>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <Skeleton className="h-56" />
      </div>
    ),
    { count: 5 },
  )

export default Page
