import { Button } from '@/components/ui/button'
import type { SiteHeaderModel } from '@/hooks/use-site-header'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function MainNav({ items }: { items: SiteHeaderModel['nav'] }) {
  return (
    <nav
      aria-label="Main"
      className="flex items-center gap-1"
    >
      {items.map((item) => (
        <Button
          key={item.href}
          asChild
          variant="ghost"
          className={cn(
            'h-9 px-2.5 font-normal text-muted-foreground hover:text-foreground sm:px-3',
            item.current && 'bg-accent font-medium text-foreground',
          )}
        >
          <Link
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
