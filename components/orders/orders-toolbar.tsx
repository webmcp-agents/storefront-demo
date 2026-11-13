import { ResultCount } from '@/components/shared/result-count'
import { SortSelect } from '@/components/shared/sort-select'
import type { OrdersPageModel } from '@/hooks/use-orders-page'

export function OrdersToolbar({ page }: { page: OrdersPageModel }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <ResultCount
        count={page.resultCount}
        noun={page.resultNoun}
      >
        {page.spent && <> · {page.spent} spent</>}
      </ResultCount>
      <SortSelect
        id="o-sort"
        label="Sort orders"
        value={page.sort}
        options={page.sortOptions}
        onChange={page.setSort}
      />
    </div>
  )
}
