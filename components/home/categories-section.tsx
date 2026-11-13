import { SectionHeader } from '@/components/home/section-header'
import { Card } from '@/components/ui/card'
import type { Category } from '@/lib/data/types'
import Image from 'next/image'
import Link from 'next/link'

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section
      aria-labelledby="cats"
      className="py-12"
    >
      <SectionHeader
        id="cats"
        title="Shop by category"
        href="/shop"
        linkLabel="All products"
      />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {categories.map((c) => (
          <li key={c.slug}>
            <CategoryTile category={c} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function CategoryTile({ category: c }: { category: Category }) {
  return (
    <Card
      asChild
      className="group press media relative block aspect-4/3 gap-0 overflow-hidden border-0 bg-surface-2 p-0 md:aspect-16/10"
    >
      <Link href={`/shop?category=${c.slug}`}>
        <Image
          src={c.image}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          className="zoom-img object-cover"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent"
        />
        <span className="absolute inset-x-4 bottom-4 text-white">
          <span className="block text-lg font-semibold leading-tight tracking-tight">
            {c.name}
          </span>
          <span className="hidden text-pretty text-caption text-white/85 sm:block">
            {c.blurb}
          </span>
        </span>
      </Link>
    </Card>
  )
}
