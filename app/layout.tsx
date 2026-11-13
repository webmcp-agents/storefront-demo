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

const title = 'WebMCP Agents: storefront demo'
const description =
  'A webmcp-agents demo: a storefront with static data where an AI agent searches, filters and shops through WebMCP tools, showing every step.'

// Icons and the share image come from `npx metadata-gen` (metadata.config.json); app/favicon.ico is the same ICO.
export const metadata: Metadata = {
  metadataBase: new URL('https://webmcp-agents-storefront-demo.mustafaskyer.workers.dev'),
  title: { default: title, template: '%s · WebMCP Agents demo' },
  description,
  applicationName: 'WebMCP Agents demo',
  icons: {
    icon: [
      { url: '/metadata/favicon.svg', type: 'image/svg+xml' },
      { url: '/metadata/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/metadata/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/metadata/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/metadata/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'WebMCP Agents',
    title,
    description,
    images: [{ url: '/metadata/og.png', width: 1200, height: 630, alt: 'WebMCP Agents storefront demo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/metadata/og.png'],
  },
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
