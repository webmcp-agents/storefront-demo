import { getLocation, getPage, getTime, goBack, goTo, scrollTo, setTheme } from '@webmcp-agents/tools'
import { navigate } from '@/lib/navigate'
import { getTheme, setTheme as applyTheme } from '@/lib/theme'
import { clearFilters } from './clear-filters'
import { filterProductsTool } from './filter-products'
import { getCart } from './get-cart'
import { getProductTool } from './get-product'
import { listCategories } from './list-categories'
import { listOrders } from './list-orders'
import { openOrder } from './open-order'
import { openProduct } from './open-product'
import { searchProducts } from './search-products'
import { trackOrder } from './track-order'
import { whoAmI } from './who-am-i'

/**
 * Every app-wide tool, by name. Each one's `match` says which pages it is on (none: everywhere).
 * Tools tied to a control on one page (add_to_cart, update_cart_item, remove_from_cart, clear_cart, place_order, reorder)
 * live next to that control and are on while it is mounted.
 */
export const webMCPTools = {
  // Common, ready-made.
  getTime: getTime({
    description:
      "The user's date, time, time zone and what 'today', 'this month', 'last week' or 'in March' mean for them. " +
      'Use before any date filter (filter_products, list_orders), which takes YYYY-MM-DD.',
  }),
  getLocation: getLocation(),
  getPage: getPage(),
  goTo: goTo({
    description:
      'Open a page of the store by name: home, shop, cart, checkout or orders. Use first, because filter_products is on shop, list_orders on orders and place_order on checkout.',
    pages: { home: '/', shop: '/shop', cart: '/cart', checkout: '/checkout', orders: '/orders' },
    // a page with no link on screen (checkout from a product page) opens with the App Router: no page load, so the
    // chat and the cursor stay
    navigate: (to) => navigate(to),
  }),
  goBack: goBack(),
  scrollTo: scrollTo(),
  // the cursor presses the header's theme toggle; `set` covers "system", which the toggle doesn't offer
  setTheme: setTheme({
    get: () => getTheme(),
    set: (theme) => applyTheme(theme),
  }),

  // The signed-in person, on every page.
  whoAmI,

  // Browsing, on every page.
  listCategories,
  searchProducts,
  getProduct: getProductTool,
  openProduct,
  getCart,

  // The shop page.
  filterProducts: filterProductsTool,
  clearFilters,

  // The orders pages (open_order works everywhere).
  listOrders,
  trackOrder,
  openOrder,
}
