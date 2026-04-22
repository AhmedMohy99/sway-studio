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
  oldPrice?: string
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
      { 
        colorName: 'Dark Black', 
        url: 'https://ik.imagekit.io/5yvgym2qm/phoenix-black.jpg', 
        tryOnImage: '/maverick-phoenix-black.png' 
      },
      { 
        colorName: 'White Base', 
        url: 'https://ik.imagekit.io/5yvgym2qm/phoenix-white.jpg', 
        tryOnImage: '/maverick-phoenix-white.png' 
      },
    ],
  },
  {
    name: 'The Powder Blue Venture Tee',
    price: '440',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e6b889925deproductimage69e6b51508e46.jpg',
    tryOnImage: '/powder-blue-tee.png',
  },
  {
    name: 'Bluish Splash',
    price: '730',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e6af828f618productimage69e6af182e668.jpg',
    tryOnImage: '/bluish-splash.png',
  },
  {
    name: 'Black Flux Sweatpants',
    price: '660',
    oldPrice: '1400',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e75f1c28fccproductimage699c03358e601.jpg',
    tryOnImage: '/black-flux-pants.png',
  },
  {
    name: 'Light Code Sweatpants',
    price: '660',
    oldPrice: '1300',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/699d9be7c3129productimage699c03358e605.jpg',
    tryOnImage: '/light-code-pants.png',
  }
]

export const PREORDER_PRODUCT: Product = {
  name: 'Eternity Protocol',
  price: '730',
  image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e14821423d8productimage69e14759939d1.jpg',
  variants: [
    { colorName: 'White', url: '/maverick-phoenix-white.png', tryOnImage: '/maverick-phoenix-white.png' },
    { colorName: 'Navy Blue', url: '/maverick-phoenix-black.png', tryOnImage: '/maverick-phoenix-black.png' },
  ],
}
