import { clsx, type ClassValue } from 'clsx'
import type { CSSProperties } from 'react'
import { extendTailwindMerge } from 'tailwind-merge'

/** tailwind-merge that knows the type scale in globals.css (text-micro/caption/body are sizes, not colors). */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['micro', 'caption', 'body'] }] } },
})

/**
 * Join class names, letting a later Tailwind class beat an earlier one from the same group.
 *
 * @param inputs - Anything clsx accepts: strings, arrays, `{ 'class-name': condition }` objects, falsy values.
 * @returns One class string, e.g. `cn('px-2 text-body', isOpen && 'px-4')` is `"text-body px-4"` when open.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Entrance order for `.animate-enter` elements: each step starts 100ms after the one before (see globals.css).
 *
 * @param i - Position in the sequence; 0 starts at once.
 * @returns A `style` object that sets `--stagger`.
 */
export const stagger = (i: number) => ({ '--stagger': i }) as CSSProperties
