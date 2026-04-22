// lib/products.ts
export type SizeOption = 'S' | 'M' | 'L' | 'XL' | '2XL'
export const SIZES: SizeOption[] = ['S', 'M', 'L', 'XL', '2XL']

export type ProductVariant = {
  colorName: string
  url: string
  tryOnImage: string
}

export type Product = {
  name: string
  price: string
  image: string
  tryOnImage?: string
  variants?: ProductVariant[]
}

export const CONTACT_LINKS = {
  whatsapp: 'https://api.whatsapp.com/send?phone=201033866838',
  instagram: 'https://www.instagram.com/swaymaverick',
}

export const TRY_TEST_PRODUCTS: Product[] = [
  {
    name: 'The Maverick Phoenix',
    price: '730',
    image: 'https://ik.imagekit.io/5yvgym2qm/phoenix-main.jpg',
    variants: [
      { colorName: 'Dark Black', url: '...', tryOnImage: '/The Maverick Phoenix Deep Black.png' },
      { colorName: 'White Base', url: '...', tryOnImage: '/The Maverick Phoenix White Base.png' },
    ],
  },
  {
    name: 'The Powder Blue Venture Tee',
    price: '440',
    image: 'https://ik.imagekit.io/5yvgym2qm/powder-blue.jpg',
    tryOnImage: '/The Powder Blue Venture Tee.png',
  },
  // ... Add your other products here
]

export const PREORDER_PRODUCT: Product = {
  name: 'Eternity Protocol',
  price: '730',
  image: 'https://ik.imagekit.io/5yvgym2qm/eternity.jpg',
  variants: [
    { colorName: 'White', url: '/Eternity Protocol White.png', tryOnImage: '/Eternity Protocol White.png' },
    { colorName: 'Navy Blue', url: '/Eternity Protocol Navy Blue.png', tryOnImage: '/Eternity Protocol Navy Blue.png' },
  ]
}
