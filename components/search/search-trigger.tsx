import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Search } from 'lucide-react'

/** The header's search box look-alike (wide screens) and search icon (narrow screens); both open the palette. */
export function SearchTrigger({
  shortcut,
  onOpen,
}: {
  shortcut: string
  onOpen: () => void
}) {
  return (
    <>
      <Button
        variant="outline"
        className="hidden w-56 justify-start gap-2 px-3 font-normal text-muted-foreground sm:inline-flex"
        aria-keyshortcuts="Meta+K Control+K /"
        onClick={onOpen}
      >
        <Search />
        <span>Search products</span>
        <Kbd
          aria-hidden
          className="ms-auto"
        >
          {shortcut}
        </Kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        aria-label="Search products"
        onClick={onOpen}
      >
        <Search />
      </Button>
    </>
  )
}
