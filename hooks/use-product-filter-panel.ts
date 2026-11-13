'use client'

import { categories } from '@/lib/data/categories'
import {
  TODAY,
  addDays,
  catalogColors,
  catalogSizes,
  countActiveFilters,
  priceBounds,
  swatchTakesDarkMark,
  type ProductFilters,
} from '@/lib/queries'
import { useProductFiltersStore } from '@/lib/stores/filters'

/** The list with `item` added, or removed when it is already there. */
const toggle = <T>(list: T[], item: T) =>
  list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
/** A number field's text as a filter amount: empty means no limit. */
const amount = (raw: string) => (raw === '' ? undefined : Number(raw))

/** The "N%+ off" pills, in percent. */
const DISCOUNT_STEPS = [20, 25, 30]
/** The "added" date shortcuts: each sets a start date that many days back and no end date. */
const ADDED_PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
]
const SIZE_GROUPS = [
  { label: 'Clothing', sizes: catalogSizes.clothing },
  { label: 'Waist', sizes: catalogSizes.waist },
  { label: 'Shoes (EU)', sizes: catalogSizes.shoes },
]

/**
 * Every option in the product filter panel, with its pressed state and the action that toggles it.
 *
 * @param f - The product filters in force.
 * @returns The panel's model: the active filter count and `clearAll`, then each group (categories, price range and
 * fields, discounts, added dates and presets, colors, size groups, in stock) with its values and the actions that
 * patch the filters store.
 */
export function useProductFilterPanel(f: ProductFilters) {
  const set = useProductFiltersStore((s) => s.patch)
  const resetProductFilters = useProductFiltersStore((s) => s.reset)
  const onlySale = f.onSale && f.minDiscount === undefined
  /** Whether a color is selected, ignoring case. */
  const color = (name: string) =>
    f.colors.some((n) => n.toLowerCase() === name.toLowerCase())

  return {
    activeCount: countActiveFilters(f),
    clearAll: resetProductFilters,

    categories: categories.map((c) => ({
      key: c.slug,
      label: c.name,
      pressed: f.categories.includes(c.slug),
      toggle: () => set({ categories: toggle(f.categories, c.slug) }),
    })),

    price: {
      bounds: priceBounds,
      range: [f.minPrice ?? priceBounds.min, f.maxPrice ?? priceBounds.max] as [
        number,
        number,
      ],
      min: f.minPrice ?? '',
      max: f.maxPrice ?? '',
      /** Set the slider's range; an end at its bound clears that limit. */
      setRange: ([lo, hi]: [number, number]) =>
        set({
          minPrice: lo <= priceBounds.min ? undefined : lo,
          maxPrice: hi >= priceBounds.max ? undefined : hi,
        }),
      setMin: (raw: string) => set({ minPrice: amount(raw) }),
      setMax: (raw: string) => set({ maxPrice: amount(raw) }),
    },

    // "On sale" is pressed only with no minimum discount; a discount pill also turns on sale, and one at a time is on.
    discounts: [
      {
        key: 'sale',
        label: 'On sale',
        pressed: onlySale,
        toggle: () => set({ onSale: !onlySale, minDiscount: undefined }),
      },
      ...DISCOUNT_STEPS.map((n) => ({
        key: String(n),
        label: `${n}%+ off`,
        pressed: f.minDiscount === n,
        toggle: () =>
          f.minDiscount === n
            ? set({ minDiscount: undefined, onSale: false })
            : set({ minDiscount: n, onSale: true }),
      })),
    ],

    added: {
      max: TODAY,
      from: f.addedFrom ?? '',
      to: f.addedTo ?? '',
      setFrom: (v: string) => set({ addedFrom: v || undefined }),
      setTo: (v: string) => set({ addedTo: v || undefined }),
      presets: ADDED_PRESETS.map((p) => {
        const from = addDays(TODAY, -p.days)
        const pressed = f.addedFrom === from && !f.addedTo
        return {
          key: String(p.days),
          label: p.label,
          pressed,
          toggle: () =>
            set({ addedFrom: pressed ? undefined : from, addedTo: undefined }),
        }
      }),
    },

    colors: catalogColors.map((c) => {
      const pressed = color(c.name)
      return {
        name: c.name,
        hex: c.hex,
        darkMark: swatchTakesDarkMark(c.hex),
        pressed,
        toggle: () =>
          set({
            colors: pressed
              ? f.colors.filter((n) => n.toLowerCase() !== c.name.toLowerCase())
              : [...f.colors, c.name],
          }),
      }
    }),

    sizeGroups: SIZE_GROUPS.map((g) => ({
      label: g.label,
      sizes: g.sizes.map((s) => ({
        value: s,
        pressed: f.sizes.includes(s),
        toggle: () => set({ sizes: toggle(f.sizes, s) }),
      })),
    })),

    inStock: { pressed: f.inStock, toggle: () => set({ inStock: !f.inStock }) },
  }
}

/** What {@link useProductFilterPanel} returns. */
export type FilterPanelModel = ReturnType<typeof useProductFilterPanel>
