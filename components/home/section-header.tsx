import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

/** A home page section's heading with a "see more" link on the opposite side. */
export function SectionHeader({
  id,
  title,
  href,
  linkLabel,
}: {
  id: string
  title: string
  href: string
  linkLabel: string
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <h2
        id={id}
        className="text-2xl font-semibold tracking-tight"
      >
        {title}
      </h2>
      <Button
        asChild
        variant="link"
        size="sm"
        className="h-auto gap-1 px-0 text-sm font-normal text-muted-foreground hover:text-foreground hover:no-underline"
      >
        <Link href={href}>
          {linkLabel} <ArrowRight className="size-3.5 rtl:-scale-x-100" />
        </Link>
      </Button>
    </div>
  )
}
