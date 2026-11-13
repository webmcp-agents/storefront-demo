import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

export default function NotFound() {
  return (
    <Empty className="mx-auto max-w-md px-6 py-32">
      <EmptyHeader>
        <EmptyMedia className="tnum mb-0 text-sm text-muted-foreground">404</EmptyMedia>
        <EmptyTitle asChild className="text-3xl font-semibold">
          <h1>We couldn’t find that page</h1>
        </EmptyTitle>
        <EmptyDescription className="text-base">It may have moved, or the product is no longer sold.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="lg">
          <Link href="/shop">Back to the shop</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
