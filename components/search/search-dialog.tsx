'use client'

import { SearchFooter } from '@/components/search/search-footer'
import { SearchResults } from '@/components/search/search-results'
import { SearchTrigger } from '@/components/search/search-trigger'
import {
  CommandDialog,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import { useSearchPalette } from '@/hooks/use-search-palette'

/** Search as a command palette: ⌘K / Ctrl+K or / opens it instantly (no motion for keyboard-driven actions). */
export function SearchDialog() {
  const search = useSearchPalette()

  return (
    <>
      <SearchTrigger
        shortcut={search.shortcut}
        onOpen={search.openPalette}
      />

      <CommandDialog
        open={search.open}
        onOpenChange={search.setOpen}
        title="Search products"
        description="Type to search the catalog. Press Enter to see every match."
        showCloseButton={false}
        className="top-[12vh] w-[min(640px,calc(100%-2rem))] max-w-none translate-y-0 gap-0 sm:max-w-none"
        // the hook filters the catalog; cmdk only handles the list's keyboard navigation
        commandProps={{ shouldFilter: false, label: 'Search products' }}
      >
        {/* The agent's search_products tool types into input[name="query"]: keep the name. Radix focuses it on open. */}
        <CommandInput
          name="query"
          aria-label="Search the catalog"
          placeholder="Search jackets, sneakers, bags…"
          value={search.query}
          onValueChange={search.setQuery}
          autoComplete="off"
          enterKeyHint="search"
        />
        <CommandList>
          <SearchResults search={search} />
        </CommandList>
        <SearchFooter status={search.status} />
      </CommandDialog>
    </>
  )
}
