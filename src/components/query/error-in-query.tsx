import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

const ErrorInQuery = ({
  scope,
  message,
}: {
  scope: string
  message: string
}) => (
  <Alert variant="destructive" className="max-w-md">
    <AlertCircleIcon />
    <AlertTitle>{`[${scope}] Query failed`}</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
)

export default ErrorInQuery
