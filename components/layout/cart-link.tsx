import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SiteHeaderModel } from '@/hooks/use-site-header'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

/** The header's cart icon with its item count; the badge pops when the count changes. */
export function CartLink({ cart }: { cart: SiteHeaderModel['cart'] }) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative"
    >
      <Link
        href="/cart"
        aria-label={cart.label}
      >
        <ShoppingBag className="size-4.5" />
        {cart.count > 0 && (
          <Badge
            key={cart.count}
            aria-hidden
            variant="brand"
            className="animate-pop absolute inset-e-0.5 top-0.5 h-4.5 min-w-4.5 px-1 leading-4.5 font-semibold"
          >
            {cart.count}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
