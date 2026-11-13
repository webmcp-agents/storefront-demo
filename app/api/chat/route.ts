import { modelFromSettings } from '@/lib/ai/model'
import { readAiSettings } from '@/lib/ai/settings-cookie'
import { agents } from '@/webmcp-agents/agents/shopper'
import { createChatHandler } from '@webmcp-agents/chat/server'

// No visitor key: fall back to the server's own (OPENAI_API_KEY etc. and WEB_AGENTS_MODEL from process.env).
const serverHandler = createChatHandler({ agents })

/**
 * The visitor's own provider, model and key (the httpOnly `ai-settings` cookie, set from the header's AI settings
 * sheet) win over the server's. The handler is cheap to build, so it is built per request with that model.
 */
async function handler(req: Request): Promise<Response> {
  const settings = await readAiSettings()
  if (!settings) return serverHandler(req)
  return createChatHandler({ agents, model: modelFromSettings(settings) })(req)
}

export const GET = handler
export const POST = handler
