import type { Category } from './types'

/** The store's categories, in navigation order. */
export const categories: Category[] = [
  {
    slug: 'outerwear',
    name: 'Outerwear',
    blurb: 'Coats and jackets built for the in-between seasons.',
    image: '/images/categories/outerwear.jpg',
  },
  {
    slug: 'tops',
    name: 'Tops',
    blurb: 'Tees, shirts and knits you will reach for every day.',
    image: '/images/categories/tops.jpg',
  },
  {
    slug: 'bottoms',
    name: 'Bottoms',
    blurb: 'Denim, trousers and shorts with a proper fit.',
    image: '/images/categories/bottoms.jpg',
  },
  {
    slug: 'footwear',
    name: 'Footwear',
    blurb: 'Sneakers, boots and loafers, broken in from day one.',
    image: '/images/categories/footwear.jpg',
  },
  {
    slug: 'bags',
    name: 'Bags',
    blurb: 'Carry everything, from commute to weekend away.',
    image: '/images/categories/bags.jpg',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    blurb: 'The small things that finish an outfit.',
    image: '/images/categories/accessories.jpg',
  },
]
