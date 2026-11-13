import { RotateCcw, Truck } from 'lucide-react'

export function ProductPerks() {
  return (
    <ul className="-mt-2 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
      <li className="flex items-center gap-2.5">
        <Truck className="size-4 shrink-0" /> Free shipping over $150
      </li>
      <li className="flex items-center gap-2.5">
        <RotateCcw className="size-4 shrink-0" /> 30-day returns
      </li>
    </ul>
  )
}
