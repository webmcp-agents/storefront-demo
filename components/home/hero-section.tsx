import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { stagger } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/** Entrance order: eyebrow, headline, copy, actions. */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero"
      className="grid items-stretch gap-6 py-6 lg:grid-cols-[1fr_1.1fr] lg:py-10"
    >
      <div className="flex flex-col justify-center gap-6 py-6 lg:py-16 lg:pe-10">
        <Badge
          variant="outline"
          className="animate-enter gap-2 border-border-strong px-3 py-1 text-caption leading-normal font-normal"
          style={stagger(0)}
        >
          <Badge
            aria-hidden
            variant="brand"
            className="size-1.5 p-0"
          />
          Autumn/Winter 2026 is here
        </Badge>
        <h1
          id="hero"
          className="animate-enter text-balance text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
          style={stagger(1)}
        >
          Clothing for the long run.
        </h1>
        <p
          className="animate-enter max-w-md text-pretty text-lg text-muted-foreground"
          style={stagger(2)}
        >
          Coats, knits, boots and bags in honest materials. Fewer things, made
          properly, worn for years.
        </p>
        <div
          className="animate-enter flex flex-wrap gap-3"
          style={stagger(3)}
        >
          <Button
            asChild
            size="lg"
          >
            <Link href="/shop?sort=newest">
              Shop new arrivals <ArrowRight className="rtl:-scale-x-100" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
          >
            <Link href="/shop?sale=1&sort=discount">See the sale</Link>
          </Button>
        </div>
      </div>
      <div className="media relative aspect-4/3 overflow-hidden rounded-[28px] bg-surface-2 lg:aspect-auto lg:min-h-140">
        <Image
          src="/images/products/striped-breton-tee.jpg"
          alt="A man in a navy and white striped tee sitting on a white bench"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    </section>
  )
}
