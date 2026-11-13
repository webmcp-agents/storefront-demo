import { Toggle } from '@/components/ui/toggle'
import type { FilterPanelModel } from '@/hooks/use-product-filter-panel'

/** Sizes in their groups (clothing, waist, shoes), each a labeled group of toggles. */
export function SizeFilter({
  groups,
}: {
  groups: FilterPanelModel['sizeGroups']
}) {
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div
          key={g.label}
          role="group"
          aria-label={g.label}
        >
          <p
            aria-hidden
            className="mb-1.5 text-caption text-muted-foreground"
          >
            {g.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {g.sizes.map((s) => (
              <Toggle
                key={s.value}
                variant="outline"
                size="sm"
                className="min-w-10"
                pressed={s.pressed}
                aria-label={`Size ${s.value}`}
                onClick={s.toggle}
              >
                {s.value}
              </Toggle>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
