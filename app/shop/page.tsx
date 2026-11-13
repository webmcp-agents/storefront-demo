import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ShopSkeleton } from '@/components/shop/shop-skeleton'
import { ShopView } from '@/components/shop/shop-view'

export const metadata: Metadata = { title: 'Shop' }

export default function ShopPage() {
  // The view reads the query string, so it sits inside Suspense (cacheComponents).
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopView />
    </Suspense>
  )
}
