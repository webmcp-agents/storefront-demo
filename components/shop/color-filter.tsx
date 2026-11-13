import { ColorSwatchToggle } from '@/components/shared/color-swatch-toggle'
import type { FilterPanelModel } from '@/hooks/use-product-filter-panel'

export function ColorFilter({
  colors,
}: {
  colors: FilterPanelModel['colors']
}) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {colors.map((c) => (
        <li key={c.name}>
          <ColorSwatchToggle
            name={c.name}
            hex={c.hex}
            darkMark={c.darkMark}
            pressed={c.pressed}
            onToggle={c.toggle}
          />
        </li>
      ))}
    </ul>
  )
}
