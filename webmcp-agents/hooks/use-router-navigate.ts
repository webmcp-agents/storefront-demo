'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { setNavigate } from '@/lib/navigate'

/**
 * Hands the App Router's `push` to lib/navigate.ts, where the module-level tools navigate (Next has no router outside
 * React): a product with no link on screen opens without a page load, so the agent's call and the cursor survive.
 *
 * @remarks Mount it once, near the root: it is called in `app/providers.tsx`. Each mount replaces the one module-level
 * `push`, and until it has run, `navigate` falls back to a full page load.
 */
export function useRouterNavigate() {
  const router = useRouter()
  useEffect(() => setNavigate((to) => router.push(to)), [router])
}
