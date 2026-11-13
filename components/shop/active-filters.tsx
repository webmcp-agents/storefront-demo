'use client'

import { Button } from '@/components/ui/button'
import { useActiveFilters } from '@/hooks/use-active-filters'
import type { ProductFilters } from '@/lib/queries'
import { X } from 'lucide-react'

export function ActiveFilters({ filters }: { filters: ProductFilters }) {
  const chips = useActiveFilters(filters)
  if (!chips.length) return null
  return (
    <ul
      className="flex flex-wrap gap-2"
      aria-label="Active filters"
    >
      {chips.map((chip) => (
        <li
          key={chip.key}
          className="animate-pop"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={chip.remove}
            aria-label={`Remove filter ${chip.label}`}
            className="gap-1.5 pe-2 font-normal text-foreground hover:bg-border"
          >
            {chip.label}
            <X className="size-3.5 text-muted-foreground" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
