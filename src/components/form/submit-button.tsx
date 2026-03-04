import { Button } from "@/components/ui/button"

const SubmitButton = ({
  isPending,
  ...buttonProps
}: { isPending?: boolean } & React.ComponentProps<typeof Button>) => (
  <Button
    {...buttonProps}
    type="submit"
    disabled={isPending}
    aria-disabled={isPending}
  />
)

export default SubmitButton
