import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function SiteLogo() {
  return (
    <Button
      asChild
      variant="ghost"
      className="me-1 h-auto gap-2 rounded-lg px-0 text-[1.0625rem] font-semibold tracking-tight hover:bg-transparent sm:me-2"
    >
      <Link
        href="/"
        aria-label="Northline home"
      >
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-lg bg-foreground text-caption font-bold text-background"
        >
          N
        </span>
        <span
          aria-hidden
          className="hidden sm:inline"
        >
          Northline
        </span>
      </Link>
    </Button>
  )
}
