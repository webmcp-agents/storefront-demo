import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import Link from 'next/link'

export function OrderNotFound({ id }: { id: string }) {
  return (
    <Empty className="mx-auto max-w-md px-6 py-28">
      <EmptyHeader>
        <EmptyTitle
          asChild
          className="text-2xl font-semibold"
        >
          <h1>Order not found</h1>
        </EmptyTitle>
        <EmptyDescription className="text-base text-pretty">
          There is no order #{id} on this account. Check the number, or find it
          in your orders.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          asChild
          size="lg"
        >
          <Link href="/orders">All orders</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
