import { Button } from '@/components/ui/button'
import { Check, ShoppingBag } from 'lucide-react'

/** Submits the purchase form; swaps to "Added" for a moment after a successful add. */
export function AddToCartButton({ added }: { added: boolean }) {
  return (
    <Button
      type="submit"
      size="lg"
      variant="brand"
      className="h-12 min-w-48 flex-1"
    >
      <span className="swap">
        <span
          data-active={!added}
          aria-hidden={added}
        >
          <ShoppingBag /> Add to cart
        </span>
        <span
          data-active={added}
          aria-hidden={!added}
        >
          <Check /> Added
        </span>
      </span>
    </Button>
  )
}
