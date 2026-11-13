import { Price } from '@/components/shared/price'
import { CommandItem } from '@/components/ui/command'
import type { SearchResultModel } from '@/hooks/use-search-palette'
import Image from 'next/image'

export function SearchResultItem({
  result,
  onSelect,
}: {
  result: SearchResultModel
  onSelect: () => void
}) {
  return (
    <CommandItem
      value={result.product.id}
      onSelect={onSelect}
    >
      <div className="media relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-2">
        <Image
          src={result.product.image}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{result.product.name}</div>
        <div className="text-caption text-muted-foreground">
          {result.category}
        </div>
      </div>
      <Price product={result.product} />
    </CommandItem>
  )
}
