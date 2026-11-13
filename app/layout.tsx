import { Providers } from '@/app/providers'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
import { geistMono, geistSans } from '@/lib/fonts'
import { themeInitScript } from '@/lib/theme'
import '@webmcp-agents/chat/chat.css'
import '@webmcp-agents/core/cursor.css'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Northline: everyday clothing and carry', template: '%s · Northline' },
  description:
    'A demo store with static data, built to show how an AI agent can search, filter and shop through WebMCP tools.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e0d' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // Next 16 keeps our smooth scroll-behavior during route changes unless asked: this makes navigation scrolls instant.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <SkipLink />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
