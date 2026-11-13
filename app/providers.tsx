'use client'

import { useRouterNavigate } from '@/webmcp-agents/hooks/use-router-navigate'
import { webMCPTools } from '@/webmcp-agents/tools'
import { ShopperChat } from '@/components/layout/shopper-chat'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAiSettingsStore } from '@/lib/stores/ai-settings'
import { useRehydrateStores } from '@/lib/stores/hydration'
import { WebAgentsProvider } from '@webmcp-agents/react'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  // open_product navigates with the App Router when no link to the product is on screen: no page load
  useRouterNavigate()
  // The cart and placed orders live in localStorage: read them once, after the first render, so hydration matches.
  useRehydrateStores()
  // A saved or removed API key (AI settings in the header) remounts the chat with a fresh adapter, which checks
  // /api/chat again and picks up the new provider. The conversation and open state survive in sessionStorage.
  const revision = useAiSettingsStore((s) => s.revision)
  return (
    <WebAgentsProvider tools={webMCPTools}>
      {/* instant, like the title attributes the tooltips replaced */}
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        {children}
      </TooltipProvider>
      <ShopperChat key={revision} />
    </WebAgentsProvider>
  )
}
