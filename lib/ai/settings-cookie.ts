import { cookies } from 'next/headers'
import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from 'node:crypto'
import {
  type AiProviderId,
  isAiProviderId,
  MODEL_ID_PATTERN,
} from './providers'

/**
 * The visitor's API keys, one per provider with the model chosen for it, plus which provider is active (the one the
 * chat uses). All in one cookie that:
 *   - is encrypted and authenticated (AES-256-GCM, key from AI_SETTINGS_SECRET): the key is unreadable in the
 *     browser's cookie store, and a cookie that was tampered with or made with another secret is ignored;
 *   - is httpOnly: page scripts (and so any injected script) can't read it, only our /api routes;
 *   - has no Max-Age or Expires: a session cookie, which the browser drops when the session ends;
 *   - is SameSite=Strict, scoped to /api, and Secure outside development.
 */
export const AI_SETTINGS_COOKIE = 'ai-settings'

/** The active provider's settings: what the chat route builds its model from. */
export interface AiSettings {
  provider: AiProviderId
  model: string
  /** The visitor's key, in plain text: server only. */
  apiKey: string
}

/** Everything in the cookie: a model and key per saved provider, and the active one. */
export interface AiSettingsJar {
  /** The provider the chat uses; null when none is (always one of `providers`' keys otherwise). */
  active: AiProviderId | null
  /** A model and key per saved provider. */
  providers: Partial<Record<AiProviderId, { model: string; apiKey: string }>>
}

/**
 * Longest key accepted. Four providers' keys and models, encrypted and base64'd, have to stay under the browser's
 * 4 KB cookie limit; real keys are well under this (OpenAI's are ~160 characters).
 */
export const MAX_API_KEY_LENGTH = 300

// ---------- encryption ----------

/** Format tag at the front of the cookie value; a value with another tag is ignored. */
const VERSION = 'v1'
/** Binds the ciphertext to this cookie: it can't be replayed as another cookie's value. */
const AAD = Buffer.from(`${AI_SETTINGS_COOKIE}:${VERSION}`)

/** The key from {@link encryptionKey}, computed once per process. */
let cachedKey: Buffer | undefined
/** Whether the missing-secret warning has been logged. */
let warned = false

/**
 * 32 bytes derived from AI_SETTINGS_SECRET. Without one, a random key for this server process: fine in development
 * (a restart only means entering the key again), wrong for production with several instances, hence the warning.
 *
 * @returns A 32-byte AES-256 key.
 * @remarks Logs a warning once when AI_SETTINGS_SECRET is missing or shorter than 32 characters.
 */
function encryptionKey(): Buffer {
  if (cachedKey) return cachedKey
  const secret = process.env.AI_SETTINGS_SECRET
  if (secret && secret.length >= 32) {
    cachedKey = Buffer.from(
      hkdfSync('sha256', secret, 'webmcp-demo', 'ai-settings-cookie', 32),
    )
  } else {
    if (!warned) {
      warned = true
      console.warn(
        '[ai-settings] AI_SETTINGS_SECRET is missing or shorter than 32 characters: using a per-process key, so saved ' +
          'API keys are lost on restart. Set it with: openssl rand -base64 48',
      )
    }
    cachedKey = randomBytes(32)
  }
  return cachedKey
}

/**
 * Encrypt and authenticate a string for the cookie.
 *
 * @param plain - Text to seal (the jar as JSON).
 * @returns `v1.` followed by base64url of IV (12 bytes), auth tag (16 bytes) and ciphertext.
 */
function seal(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  cipher.setAAD(AAD)
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  return `${VERSION}.${Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url')}`
}

/**
 * Decrypt a value made by {@link seal}. Never throws: every failure is null.
 *
 * @param sealed - The cookie value.
 * @returns The plain text, or null when the value is malformed, tampered with, or sealed with another key.
 */
function open(sealed: string): string | null {
  const [version, data] = sealed.split('.')
  if (version !== VERSION || !data) return null
  const raw = Buffer.from(data, 'base64url')
  if (raw.length < 12 + 16 + 1) return null
  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      encryptionKey(),
      raw.subarray(0, 12),
    )
    decipher.setAAD(AAD)
    decipher.setAuthTag(raw.subarray(12, 28))
    return Buffer.concat([
      decipher.update(raw.subarray(28)),
      decipher.final(),
    ]).toString('utf8')
  } catch {
    return null // tampered, or sealed with another secret
  }
}

// ---------- cookie ----------

/** The jar with nothing saved. */
/** A jar with nothing saved. A new object each call, so a caller that changes it can't leak into later requests. */
const emptyJar = (): AiSettingsJar => ({ active: null, providers: {} })

/**
 * Whether a decoded entry has a valid model id and a non-empty key no longer than {@link MAX_API_KEY_LENGTH}.
 *
 * @param e - One provider's entry from the decoded cookie.
 */
const validEntry = (e: unknown): e is { model: string; apiKey: string } =>
  typeof e === 'object' &&
  e !== null &&
  typeof (e as { model?: unknown }).model === 'string' &&
  MODEL_ID_PATTERN.test((e as { model: string }).model) &&
  typeof (e as { apiKey?: unknown }).apiKey === 'string' &&
  (e as { apiKey: string }).apiKey.length > 0 &&
  (e as { apiKey: string }).apiKey.length <= MAX_API_KEY_LENGTH

/**
 * Read a cookie value into a jar, dropping invalid entries. Also reads the older single-provider format.
 *
 * @param raw - The cookie value, if any.
 * @returns The jar; a new empty one ({@link emptyJar}) when the cookie is missing, can't be opened, or isn't valid JSON.
 */
function decode(raw: string | undefined): AiSettingsJar {
  const plain = raw ? open(raw) : null
  if (!plain) return emptyJar()
  try {
    const value = JSON.parse(plain) as Record<string, unknown>
    // the first format held a single provider: { provider, model, apiKey }
    const legacy = value.provider
    if (isAiProviderId(legacy) && validEntry(value)) {
      return {
        active: legacy,
        providers: { [legacy]: { model: value.model, apiKey: value.apiKey } },
      }
    }
    const providers: AiSettingsJar['providers'] = {}
    for (const [id, entry] of Object.entries(
      (value.providers as Record<string, unknown>) ?? {},
    )) {
      if (isAiProviderId(id) && validEntry(entry))
        providers[id] = { model: entry.model, apiKey: entry.apiKey }
    }
    const active =
      isAiProviderId(value.active) && providers[value.active]
        ? value.active
        : null
    return { active, providers }
  } catch {
    return emptyJar()
  }
}

/** Cookie attributes; see {@link AI_SETTINGS_COOKIE}. */
const options = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/api',
} as const

/**
 * Everything saved in the visitor's settings cookie.
 *
 * @returns The jar; empty when the cookie is missing, tampered with or unreadable (a bad cookie never throws).
 * @remarks Server only: uses `cookies()` from next/headers.
 */
export async function readAiSettingsJar(): Promise<AiSettingsJar> {
  return decode((await cookies()).get(AI_SETTINGS_COOKIE)?.value)
}

/**
 * Writes the jar; with no providers left the cookie is deleted instead.
 *
 * @param jar - What to save, sealed with {@link seal}.
 * @throws {Error} when called while a server component renders: Next.js only lets route handlers and server actions
 * set cookies.
 * @remarks Server only: uses `cookies()` from next/headers.
 */
export async function writeAiSettingsJar(jar: AiSettingsJar): Promise<void> {
  const store = await cookies()
  if (Object.keys(jar.providers).length === 0) {
    store.set(AI_SETTINGS_COOKIE, '', { ...options, maxAge: 0 })
    return
  }
  store.set(AI_SETTINGS_COOKIE, seal(JSON.stringify(jar)), options)
}

/**
 * The active provider's settings, or null when none is active.
 *
 * @returns What `modelFromSettings` builds the chat's model from.
 * @remarks Server only: uses `cookies()` from next/headers.
 */
export async function readAiSettings(): Promise<AiSettings | null> {
  const jar = await readAiSettingsJar()
  const entry = jar.active ? jar.providers[jar.active] : undefined
  return jar.active && entry ? { provider: jar.active, ...entry } : null
}
