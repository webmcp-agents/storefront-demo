import { SearchResultItem } from '@/components/search/search-result-item'
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import type { SearchPaletteModel } from '@/hooks/use-search-palette'
import { ArrowRight, Search } from 'lucide-react'

/** "See all results" first, so Enter right after typing still means "see every match", then the products. */
export function SearchResults({ search }: { search: SearchPaletteModel }) {
  const hasResults = search.results.length > 0
  return (
    <>
      <CommandEmpty>
        Nothing matches “{search.query}”. Try a category like “bags” or a color
        like “black”.
      </CommandEmpty>
      {search.query && hasResults && (
        <CommandGroup>
          <CommandItem
            value="__all__"
            onSelect={search.seeAll}
          >
            <Search />
            <span className="flex-1 truncate">
              See all results for “{search.query}”
            </span>
            <ArrowRight className="rtl:-scale-x-100" />
          </CommandItem>
        </CommandGroup>
      )}
      {hasResults && (
        <CommandGroup heading="Products">
          {search.results.map((r) => (
            <SearchResultItem
              key={r.product.id}
              result={r}
              onSelect={() => search.go(r.href)}
            />
          ))}
        </CommandGroup>
      )}
    </>
  )
}
