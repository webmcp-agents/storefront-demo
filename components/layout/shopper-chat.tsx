'use client'

import { ASSISTANT_PROMPTS } from '@/lib/data/assistant'
import { shopperAgent } from '@/webmcp-agents/agents/shopper'
import { AgentChat, createCloudAdapter } from '@webmcp-agents/chat'
import { endChatRestore } from '@/lib/chat-restore'
import { useEffect, useState } from 'react'

/** The docked shopping assistant. Remount it (new `key`) to pick up a changed AI provider. */
export function ShopperChat() {
  const [adapter] = useState(createCloudAdapter)
  // A reload with the chat open is docked before the first paint (chatRestoreScript); hand over to the real panel.
  useEffect(endChatRestore, [])
  return (
    <AgentChat
      adapter={adapter}
      agent={shopperAgent}
      layout="docked"
      // In development the provider's devtools launcher has the other corner.
      position={'bottom-left'}
      suggestions={ASSISTANT_PROMPTS}
    />
  )
}
