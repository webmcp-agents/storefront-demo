import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'
import type { CartItemModel } from '@/hooks/use-cart-page'

/** − quantity +. The agent's update_cart_item tool targets the "Increase quantity of …" label: keep it. */
export function CartQuantity({ item }: { item: CartItemModel }) {
  const name = item.product.name
  return (
    <ButtonGroup aria-label={`Quantity of ${name}`}>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={`Decrease quantity of ${name}`}
        disabled={!item.canDecrease}
        onClick={item.decrease}
      >
        <Minus />
      </Button>
      <ButtonGroupText className="tnum h-8 w-9 justify-center rounded-none bg-card px-0">{item.quantity}</ButtonGroupText>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={`Increase quantity of ${name}`}
        disabled={!item.canIncrease}
        onClick={item.increase}
      >
        <Plus />
      </Button>
    </ButtonGroup>
  )
}
