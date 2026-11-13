import { Button } from '@/components/ui/button'
import type { NavLink } from '@/lib/navigation'
import Link from 'next/link'

/** A titled column of footer links. */
export function FooterNav({
  id,
  title,
  links,
}: {
  id: string
  title: string
  links: readonly NavLink[]
}) {
  return (
    <nav aria-labelledby={id}>
      <h2
        id={id}
        className="text-caption font-medium"
      >
        {title}
      </h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.href}>
            {/* shadcn's link button, sized to read as text in a list */}
            <Button
              asChild
              variant="link"
              size="sm"
              className="h-auto px-0 py-0.5 text-sm font-normal text-muted-foreground hover:text-foreground"
            >
              <Link href={l.href}>{l.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
