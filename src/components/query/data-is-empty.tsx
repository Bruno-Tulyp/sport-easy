import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

const DataIsEmpty = ({ description }: { description: string }) => (
  <Alert className="max-w-md">
    <InfoIcon />
    <AlertTitle>No data available</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
)

export default DataIsEmpty
