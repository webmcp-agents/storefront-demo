import { CartHeader } from '@/components/cart/cart-header'
import { CartLineList } from '@/components/cart/cart-line-list'
import { CartSummary } from '@/components/cart/cart-summary'
import { UndoNotice } from '@/components/cart/undo-notice'
import type { CartPageModel } from '@/hooks/use-cart-page'

/** The cart with lines in it: header, undo notice, the lines and the order summary. */
export function CartContent({ cart }: { cart: CartPageModel }) {
  return (
    <div className="mx-auto max-w-275 px-4 py-8 sm:px-6 lg:py-12">
      <CartHeader
        count={cart.count}
        onClear={cart.clear}
      />
      <UndoNotice notice={cart.notice} />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <CartLineList items={cart.items} />
        <CartSummary
          summary={cart.summary}
          freeShipping={cart.freeShipping}
        />
      </div>
    </div>
  )
}
