import { CheckoutSummary } from '@/components/checkout/checkout-summary'
import { DeliveryForm } from '@/components/checkout/delivery-form'
import type { CheckoutModel } from '@/hooks/use-checkout'

export function CheckoutContent({ checkout }: { checkout: CheckoutModel }) {
  return (
    <div className="mx-auto max-w-250 px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Checkout</h1>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <DeliveryForm
          form={checkout.form}
          fields={checkout.fields}
          total={checkout.total}
          onSubmit={checkout.submit}
        />
        <CheckoutSummary
          items={checkout.items}
          shipping={checkout.shipping}
          total={checkout.total}
        />
      </div>
    </div>
  )
}
