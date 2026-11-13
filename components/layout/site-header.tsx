'use client'

import { AiSettings } from '@/components/ai-settings/ai-settings'
import { CartLink } from '@/components/layout/cart-link'
import { MainNav } from '@/components/layout/main-nav'
import { SiteLogo } from '@/components/layout/site-logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { SearchDialog } from '@/components/search/search-dialog'
import { useSiteHeader } from '@/hooks/use-site-header'

export function SiteHeader() {
  const header = useSiteHeader()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-330 items-center gap-1 px-4 sm:gap-4 sm:px-6">
        <SiteLogo />
        <MainNav items={header.nav} />
        <div className="ms-auto flex items-center gap-0.5 sm:gap-1.5">
          <SearchDialog />
          <AiSettings />
          <ThemeToggle />
          <CartLink cart={header.cart} />
        </div>
      </div>
    </header>
  )
}
