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
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e69abfcec21productimage69e69a06054c4.jpg',
    variants: [
      { 
        colorName: 'Dark Black', 
        url: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e69abfcec21productimage69e69a06054c4.jpg', 
        tryOnImage: '/maverick-phoenix-black.png' 
      },
      { 
        colorName: 'White Base', 
        url: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e69abfcec21productimage69e69a06054c4.jpg',
        tryOnImage: '/maverick-phoenix-white.png' 
      },
    ],
  },
  {
    name: 'The Powder Blue Venture Tee',
    price: '440',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e6b889925deproductimage69e6b51508e46.jpg',
    tryOnImage: '/powder-blue-venture-tee.png',
  },
  {
    name: 'The Catalyst Tee',
    price: '730',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e6b1f0dd14cproductimage69e6b1aa693e8.jpg',
    tryOnImage: '/catalyst-tee.png',
  },
  {
    name: 'Bluish Splash',
    price: '730',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e6af828f618productimage69e6af182e668.jpg',
    tryOnImage: '/bluish-splash.png',
  },
  {
    name: 'Yellowish Splash',
    price: '730',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e6ad3d902f4productimage69e6ac753e18a.jpg',
    tryOnImage: '/yellowish-splash.png',
  },
  {
    name: 'Greenish Splash',
    price: '730',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e6aa596ae5cproductimage69e6a931d9611.jpg',
    tryOnImage: '/greenish-splash.png',
  },
  {
    name: 'Cyber Crescent',
    price: '730',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e6a659a24b7productimage69e6a59ddf53b.jpg',
    tryOnImage: '/cyber-crescent.png',
  },
  {
    name: 'Black Flux Sweatpants',
    price: '660',
    oldPrice: '1400',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e75f1c28fccproductimage699c03358e601.jpg',
    tryOnImage: '/black-flux-sweatpants.png',
  },
  {
    name: 'Light Code Sweatpants',
    price: '660',
    oldPrice: '1300',
    image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/699d9be7c3129productimage699c03358e605.jpg',
    tryOnImage: '/light-code-sweatpants.png',
  },
]

export const PREORDER_PRODUCT: Product = {
  name: 'Eternity Protocol',
  price: '730',
  image: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e14821423d8productimage69e14759939d1.jpg',
  variants: [
    { 
      colorName: 'White', 
      url: 'https://ik.imagekit.io/5yvgym2qm/tr:w-1000,h-1500/products/696e0bcb55259/69e14821423d8productimage69e14759939d1.jpg', 
      tryOnImage: '/eternity-protocol-white.png' 
    },
    { 
      colorName: 'Navy Blue', 
      url: 'https://ik.imagekit.io/5yvgym2qm/tr:w-null,h-null//products/696e0bcb55259/69e1482150dd4productimage69e14759939d1.jpg', 
      tryOnImage: '/eternity-protocol-navy.png' 
    },
  ],
}
