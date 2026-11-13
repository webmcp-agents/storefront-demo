import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import Link from 'next/link'

export function CheckoutEmpty() {
  return (
    <Empty className="mx-auto max-w-md px-6 py-28">
      <EmptyHeader>
        {/* the page's only heading */}
        <EmptyTitle
          asChild
          className="text-2xl font-semibold"
        >
          <h1>Nothing to check out</h1>
        </EmptyTitle>
        <EmptyDescription className="text-base">
          Your cart is empty. Add something from the shop first.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          asChild
          size="lg"
        >
          <Link href="/shop">Back to the shop</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
