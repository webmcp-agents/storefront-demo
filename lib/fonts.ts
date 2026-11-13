import { Geist, Geist_Mono } from 'next/font/google'

/** Geist, the UI typeface; its `className` defines `--font-geist-sans`. */
export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

/** Geist Mono, for code; its `className` defines `--font-geist-mono`. */
export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
