import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

const FormFieldInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues,
>({
  name,
  control,
  label,
  description,
  ...inputProps
}: {
  name: TName
  control: Control<TFieldValues, unknown, TTransformedValues>
  label: string
  description?: string
} & React.ComponentProps<typeof Input>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        <Input
          {...inputProps}
          {...field}
          id={field.name}
          aria-invalid={fieldState.invalid}
        />
        {description && <FieldDescription>{description}</FieldDescription>}
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
)

export default FormFieldInput
