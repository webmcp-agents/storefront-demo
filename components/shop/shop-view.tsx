'use client'

import { ProductGrid } from '@/components/shared/product-grid'
import { ActiveFilters } from '@/components/shop/active-filters'
import { FilterPanel } from '@/components/shop/filter-panel'
import { ShopEmpty } from '@/components/shop/shop-empty'
import { ShopHeader } from '@/components/shop/shop-header'
import { ShopToolbar } from '@/components/shop/shop-toolbar'
import { useShopCatalog } from '@/hooks/use-shop-catalog'
import { SHOP_PRIORITY_IMAGES } from '@/lib/queries'

export function ShopView() {
  const shop = useShopCatalog()

  return (
    <div className="mx-auto max-w-330 px-4 pb-8 pt-8 sm:px-6">
      <ShopHeader
        heading={shop.heading}
        intro={shop.intro}
      />

      <div className="grid gap-8 lg:grid-cols-[264px_minmax(0,1fr)]">
        {/* The agent's filter_products tool targets this <aside> and its sticky <div> child by label: keep both. */}
        <aside
          aria-label="Filters"
          className="hidden lg:block"
        >
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pe-3">
            <FilterPanel filters={shop.filters} />
          </div>
        </aside>

        <section aria-label="Products">
          <ShopToolbar shop={shop} />
          <ActiveFilters filters={shop.filters} />
          {shop.resultCount === 0 ? (
            <ShopEmpty onClear={shop.clearAll} />
          ) : (
            <ProductGrid
              products={shop.results}
              priorityCount={SHOP_PRIORITY_IMAGES}
              className="mt-6 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4"
            />
          )}
        </section>
      </div>
    </div>
  )
}
