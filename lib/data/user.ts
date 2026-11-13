/** The signed-in shopper. Static demo data: the store has no accounts, so everyone is this person. */
export interface UserProfile {
  fullName: string
  email: string
  address: string
  city: string
  /** What the shopper tends to want, for the assistant to lean on. */
  preferences?: {
    /** Lowercase color names. */
    colors: Array<string>
    /** Preferred clothing size, in words (not the catalog's XS–XL). */
    size:
      | 'xsmall'
      | 'small'
      | 'medium'
      | 'large'
      | 'xlarge'
      | '2xlarge'
      | '3xlarge'
  }
}

/** The demo shopper everyone is signed in as. */
export const currentUser: UserProfile = {
  fullName: 'Mustafa Elsayed',
  email: 'mustafa@mail.sa',
  address: 'Riyadh, king fahad',
  city: 'Riyadh',
  preferences: {
    colors: ['black', 'white', 'green'],
    size: 'medium',
  },
}
