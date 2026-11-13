import { AssistantSection } from '@/components/home/assistant-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { HeroSection } from '@/components/home/hero-section'
import { NewInSection } from '@/components/home/new-in-section'
import { PromisesSection } from '@/components/home/promises-section'
import { SaleSection } from '@/components/home/sale-section'
import { ASSISTANT_PROMPTS } from '@/lib/data/assistant'
import { categories } from '@/lib/data/categories'
import { HOME_SHELF_SIZE, maxDiscount, newArrivals, topDeals } from '@/lib/queries'

export default function Home() {
  return (
    <div className="mx-auto max-w-330 px-4 sm:px-6">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <NewInSection products={newArrivals(HOME_SHELF_SIZE)} />
      <SaleSection products={topDeals(HOME_SHELF_SIZE)} maxDiscount={maxDiscount()} />
      <AssistantSection prompts={ASSISTANT_PROMPTS} />
      <PromisesSection />
    </div>
  )
}
