import { ResultCount } from '@/components/shared/result-count'
import { SortSelect } from '@/components/shared/sort-select'
import { FiltersSheet } from '@/components/shop/filters-sheet'
import type { ShopCatalogModel } from '@/hooks/use-shop-catalog'

/** Result count, the small-screen filters sheet and the sort. */
export function ShopToolbar({ shop }: { shop: ShopCatalogModel }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <ResultCount
        count={shop.resultCount}
        noun={shop.resultNoun}
        className="me-auto"
      />
      <FiltersSheet shop={shop} />
      <SortSelect
        id="sort"
        label="Sort products"
        value={shop.sort}
        options={shop.sortOptions}
        onChange={shop.setSort}
      />
    </div>
  )
}
