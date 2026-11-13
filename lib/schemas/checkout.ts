import { z } from 'zod'

/**
 * Delivery details at checkout. One schema serves both the form (its messages are the field errors) and the
 * `place_order` agent tool (its descriptions tell the agent where each value comes from).
 */
export const deliveryDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter your full name.')
    .describe('Full name for delivery. From who_am_i, or ask the person; never invent it.'),
  email: z
    .string()
    .trim()
    .email('Enter an email address like name@example.com.')
    .describe('Email for the receipt. From who_am_i, or ask the person.'),
  address: z
    .string()
    .trim()
    .min(4, 'Enter your street address and number.')
    .describe('Street address. From who_am_i, or ask the person.'),
  city: z
    .string()
    .trim()
    .min(2, 'Enter the city to deliver to.')
    .describe('City. From who_am_i, or ask the person.'),
})

/** Valid delivery details. */
export type DeliveryDetails = z.infer<typeof deliveryDetailsSchema>

/** The delivery form before anything is typed. */
export const EMPTY_DELIVERY_DETAILS: DeliveryDetails = { fullName: '', email: '', address: '', city: '' }
