import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductDetail } from '@/components/product/product-detail'
import { ProductSkeleton } from '@/components/product/product-skeleton'
import { RelatedProducts } from '@/components/product/related-products'
import { products } from '@/lib/data/products'
import { getProductBySlug, relatedProducts } from '@/lib/queries'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/product/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  return { title: getProductBySlug(slug)?.name ?? 'Product' }
}

async function Product({ params }: Pick<PageProps<'/product/[slug]'>, 'params'>) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  return (
    <>
      <ProductDetail product={product} />
      <RelatedProducts products={relatedProducts(product)} />
    </>
  )
}

export default function ProductPage({ params }: PageProps<'/product/[slug]'>) {
  // The slug is URL data: it resolves inside Suspense, so a navigation shows this route's shell at once
  // (cacheComponents + partialPrefetching).
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Product params={params} />
    </Suspense>
  )
}
