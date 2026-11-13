'use client'

import { OrderFilters } from '@/components/orders/order-filters'
import { OrderList } from '@/components/orders/order-list'
import { OrdersEmpty } from '@/components/orders/orders-empty'
import { OrdersHeader } from '@/components/orders/orders-header'
import { OrdersToolbar } from '@/components/orders/orders-toolbar'
import { useOrdersPage } from '@/hooks/use-orders-page'

export function OrdersView() {
  const page = useOrdersPage()

  return (
    <div className="mx-auto max-w-275 px-4 py-8 sm:px-6 lg:py-12">
      <OrdersHeader />
      <OrderFilters page={page} />
      <OrdersToolbar page={page} />
      {page.resultCount === 0 ? (
        <OrdersEmpty
          hasOrders={page.hasOrders}
          onClear={page.clearAll}
        />
      ) : (
        <OrderList orders={page.orders} />
      )}
    </div>
  )
}
