import { PackageOpen } from 'lucide-react'
import Link from 'next/link'
import { UndoNotice } from '@/components/cart/undo-notice'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import type { CartNotice } from '@/hooks/use-cart-page'

/** The empty cart; keeps the undo notice, so clearing or removing the last line can be undone from here. */
export function CartEmpty({ notice }: { notice: CartNotice }) {
  return (
    <div className="mx-auto max-w-md px-6 py-28">
      <UndoNotice notice={notice} />
      <Empty className="animate-fade p-0 md:p-0">
        <EmptyHeader>
          <EmptyMedia>
            <PackageOpen className="size-10 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle asChild className="text-2xl font-semibold">
            <h1>Your cart is empty</h1>
          </EmptyTitle>
          <EmptyDescription className="text-base text-pretty">Browse the new arrivals and add something you like.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="lg">
            <Link href="/shop?sort=newest">Shop new arrivals</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
