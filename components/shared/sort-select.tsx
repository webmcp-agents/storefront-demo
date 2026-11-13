import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

/** A sort dropdown with a visually hidden label. */
export function SortSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: readonly { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="w-full sm:w-52">
      <Label
        htmlFor={id}
        className="sr-only"
      >
        {label}
      </Label>
      <NativeSelect
        id={id}
        name="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((s) => (
          <NativeSelectOption
            key={s.value}
            value={s.value}
          >
            {s.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}
