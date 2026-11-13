import { defineWebTool } from '@webmcp-agents/core'
import { currentUser } from '@/lib/data/user'

/**
 * `who_am_i`: the signed-in person's profile (fullName, email, address, city), whose field names match `place_order`'s.
 *
 * On every page (no `match`). Read-only; never throws.
 */
export const whoAmI = defineWebTool({
  id: 'who_am_i',
  title: 'Who am I',
  description:
    "The signed-in person's profile: fullName, email, address and city. Works on every page. " +
    'Use for "who am I" questions and before place_order, whose fields match these names. Next: go_to checkout, then place_order.',
  readOnly: true,
  execute: () => ({ ...currentUser }),
})
