import { Skeleton } from "@/components/ui/skeleton"
import { faker } from "@faker-js/faker"

const Page = () =>
  faker.helpers.multiple(
    (_, index) => (
      <div className="grid grid-cols-1 gap-4" key={index}>
        <Skeleton className="h-56" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </div>
    ),
    { count: 5 },
  )

export default Page
