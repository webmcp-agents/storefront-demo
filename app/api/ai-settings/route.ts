import { type AiSettingsStatus, isAiProviderId, MODEL_ID_PATTERN } from '@/lib/ai/providers'
import {
  type AiSettingsJar,
  MAX_API_KEY_LENGTH,
  MissingAiSettingsSecretError,
  readAiSettingsJar,
  writeAiSettingsJar,
} from '@/lib/ai/settings-cookie'

const noStore = { 'cache-control': 'no-store' }

const fail = (error: string) => Response.json({ error }, { status: 400, headers: noStore })

/** What's saved, without the keys: the page can't read the httpOnly cookie, so it asks here. */
function statusOf(jar: AiSettingsJar): AiSettingsStatus {
  const saved: AiSettingsStatus['saved'] = {}
  for (const [id, entry] of Object.entries(jar.providers)) {
    if (isAiProviderId(id) && entry) saved[id] = { model: entry.model, keyHint: entry.apiKey.slice(-4) }
  }
  const active = jar.active ? saved[jar.active] : undefined
  return jar.active && active
    ? { configured: true, provider: jar.active, model: active.model, keyHint: active.keyHint, saved }
    : { configured: false, saved }
}

const respond = (jar: AiSettingsJar) => Response.json(statusOf(jar), { headers: noStore })

export async function GET() {
  return respond(await readAiSettingsJar())
}

/**
 * Save a provider's model and key and make it the active one. An omitted key keeps the one saved for that provider,
 * so switching model or switching back to a provider never means pasting its key again.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { provider?: unknown; model?: unknown; apiKey?: unknown } | null
  if (!body || !isAiProviderId(body.provider)) return fail('Choose a provider.')
  const model = typeof body.model === 'string' ? body.model.trim() : ''
  if (!MODEL_ID_PATTERN.test(model)) return fail('Enter a model ID, such as gpt-6.1-sol.')

  const jar = await readAiSettingsJar()
  const typedKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : ''
  const apiKey = typedKey || jar.providers[body.provider]?.apiKey || ''
  if (!apiKey || /\s/.test(apiKey)) return fail('Enter your API key.')
  if (apiKey.length > MAX_API_KEY_LENGTH) return fail(`API keys can be up to ${MAX_API_KEY_LENGTH} characters.`)

  const next: AiSettingsJar = {
    active: body.provider,
    providers: { ...jar.providers, [body.provider]: { model, apiKey } },
  }
  try {
    await writeAiSettingsJar(next)
  } catch (err) {
    if (!(err instanceof MissingAiSettingsSecretError)) throw err
    console.error(`[ai-settings] ${err.message}`)
    return Response.json(
      { error: "This site can't save API keys right now: it's missing its encryption secret." },
      { status: 503, headers: noStore },
    )
  }
  return respond(next)
}

/**
 * `?provider=<id>` removes that provider's key; without it, every key. Removing the active provider hands the chat to
 * another saved one, if there is one.
 */
export async function DELETE(req: Request) {
  const provider = new URL(req.url).searchParams.get('provider')
  if (provider !== null && !isAiProviderId(provider)) return fail('Unknown provider.')

  const jar = await readAiSettingsJar()
  const providers = { ...jar.providers }
  if (provider) delete providers[provider]
  else for (const id of Object.keys(providers)) delete providers[id as keyof typeof providers]

  const remaining = Object.keys(providers).filter(isAiProviderId)
  const active = jar.active && providers[jar.active] ? jar.active : (remaining[0] ?? null)
  const next: AiSettingsJar = { active, providers }
  await writeAiSettingsJar(next)
  return respond(next)
}
