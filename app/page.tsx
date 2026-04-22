'use client'

import { useState, useEffect } from 'react'
import {
  TRY_TEST_PRODUCTS,
  PREORDER_PRODUCT,
  CONTACT_LINKS,
  SIZES, 
  type Product,
  type SizeOption,
} from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'
import SizeGuide from '@/components/SizeGuide'

export default function Home() {
  const [activeSection, setActiveSection] = useState<'try-test' | 'preorder'>('try-test')
  const [tryOnOpen, setTryOnOpen] = useState(false)
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null)
  const [tryOnImage, setTryOnImage] = useState('')
  const [tryOnSize, setTryOnSize] = useState<SizeOption>('L')
  const [mode, setMode] = useState<'camera' | 'upload'>('camera')
  const [userUploadedImg, setUserUploadedImg] = useState<string | null>(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (tryOnOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.height = 'auto'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.height = 'auto'
    }
  }, [tryOnOpen])

  const openTryOn = (prod: Product) => {
    setTryOnProduct(prod)
    setSelectedVariantIndex(0)
    setTryOnImage(prod.variants ? prod.variants[0].tryOnImage : (prod.tryOnImage || prod.image))
    setTryOnOpen(true)
    setMode('camera')
    setUserUploadedImg(null)
  }

  const handleVariantChange = (index: number) => {
    if (!tryOnProduct?.variants) return
    setSelectedVariantIndex(index)
    setTryOnImage(tryOnProduct.variants[index].tryOnImage)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const url = URL.createObjectURL(file)
      setUserUploadedImg(url)
      setMode('upload')
    }
  }

  const closeTryOn = () => {
    setTryOnOpen(false)
    // Cleanup object URL
    if (userUploadedImg) {
      URL.revokeObjectURL(userUploadedImg)
      setUserUploadedImg(null)
    }
  }

  const handleOrder = () => {
    if (!tryOnProduct) return
    
    const variantInfo = tryOnProduct.variants 
      ? ` - ${tryOnProduct.variants[selectedVariantIndex].colorName}` 
      : ''
    
    const message = `Order: ${tryOnProduct.name}${variantInfo} | Size: ${tryOnSize}`
    const encodedMessage = encodeURIComponent(message)
    
    window.open(`${CONTACT_LINKS.whatsapp}&text=${encodedMessage}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-5">
          <h1 className="text-xl font-black italic text-cyan-400 uppercase tracking-tighter">
            SWAY STUDIO
          </h1>
          <button 
            onClick={() => setSizeGuideOpen(true)} 
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Size Guide
          </button>
        </div>
      </nav>

      {/* Section Toggle */}
      <div className="pt-24 flex justify-center gap-4 mb-12 px-6">
        <button 
          onClick={() => setActiveSection('try-test')} 
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            activeSection === 'try-test' 
              ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
              : 'border-white/10 text-zinc-600 hover:border-white/20 hover:text-zinc-400'
          }`}
        >
          AI Studio
        </button>
        <button 
          onClick={() => setActiveSection('preorder')} 
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            activeSection === 'preorder' 
              ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
              : 'border-white/10 text-zinc-600 hover:border-white/20 hover:text-zinc-400'
          }`}
        >
          Pre-Order
        </button>
      </div>

      {/* AI Studio Section */}
      {activeSection === 'try-test' && (
        <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto pb-32">
          {TRY_TEST_PRODUCTS.map((prod) => (
            <div key={prod.name} className="group">
              <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
                <img 
                  src={prod.image} 
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-12">
                  <button 
                    onClick={() => openTryOn(prod)} 
                    className="bg-white text-black px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all hover:bg-cyan-400"
                  >
                    Launch AI Studio
                  </button>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  {prod.name}
                </h3>
                <p className="mt-2 text-white font-bold">
                  {prod.price} EGP
                  {prod.oldPrice && (
                    <span className="ml-2 text-zinc-600 line-through text-sm">
                      {prod.oldPrice} EGP
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pre-Order Section */}
      {activeSection === 'preorder' && (
        <div className="px-6 max-w-2xl mx-auto pb-32">
          <div className="group">
            <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
              <img 
                src={PREORDER_PRODUCT.image} 
                alt={PREORDER_PRODUCT.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-12">
                <button 
                  onClick={() => openTryOn(PREORDER_PRODUCT)} 
                  className="bg-white text-black px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all hover:bg-cyan-400"
                >
                  Launch AI Studio
                </button>
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400">
                {PREORDER_PRODUCT.name}
              </h3>
              <p className="mt-2 text-white font-bold">{PREORDER_PRODUCT.price} EGP</p>
              <p className="mt-2 text-[10px] text-zinc-600 uppercase tracking-widest">
                Pre-Order Now
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Try-On Modal */}
      {tryOnOpen && tryOnProduct && (
        <div className="fixed inset-0 z-[100] bg-[#080808] flex flex-col overflow-hidden">
          {/* Modal Header */}
          <div className="flex-shrink-0 w-full flex justify-between items-center px-6 py-6 border-b border-white/5">
            <h2 className="text-xl sm:text-2xl font-black italic uppercase text-white truncate max-w-[70%]">
              {tryOnProduct.name}
            </h2>
            <button 
              onClick={closeTryOn} 
              className="text-zinc-500 hover:text-white text-2xl transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="max-w-xl mx-auto">
              {/* Mode Toggle */}
              <div className="flex gap-3 my-6 bg-zinc-950 p-2 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setMode('camera')} 
                  className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                    mode === 'camera' 
                      ? 'bg-white text-black' 
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  Live Camera
                </button>
                <label 
                  className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase cursor-pointer text-center transition-all ${
                    mode === 'upload' 
                      ? 'bg-white text-black' 
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  Upload Photo
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                  />
                </label>
              </div>

              {/* Try-On Viewport */}
              <div className="w-full aspect-[3/4] rounded-[56px] overflow-hidden bg-black border border-white/10 relative shadow-2xl">
                {mode === 'camera' ? (
                  <TryOnEngine 
                    itemUrl={tryOnImage} 
                    selectedSize={tryOnSize} 
                    productName={tryOnProduct.name}
                  />
                ) : (
                  <div className="relative w-full h-full bg-zinc-900">
                    {userUploadedImg ? (
                      <>
                        <img 
                          src={userUploadedImg} 
                          alt="User upload"
                          className="w-full h-full object-cover" 
                        />
                        <img 
                          src={tryOnImage} 
                          alt="Garment overlay"
                          className="absolute inset-0 w-full h-full object-contain p-16 drop-shadow-2xl" 
                        />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                            Select a photo
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Variant Selector */}
              {tryOnProduct.variants && tryOnProduct.variants.length > 1 && (
                <div className="mt-8">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-3">
                    Color
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {tryOnProduct.variants.map((v, idx) => (
                      <button 
                        key={v.colorName} 
                        onClick={() => handleVariantChange(idx)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase border-2 transition-all ${
                          selectedVariantIndex === idx
                            ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5' 
                            : 'border-white/10 text-zinc-700 hover:border-white/20 hover:text-zinc-500'
                        }`}
                      >
                        {v.colorName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mt-8">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-3">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setTryOnSize(s)}
                      className={`w-14 h-14 rounded-2xl font-black text-xs transition-all ${
                        tryOnSize === s 
                          ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30' 
                          : 'bg-zinc-900 text-zinc-700 border border-white/5 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Button */}
              <button 
                onClick={handleOrder}
                className="mt-10 w-full bg-white text-black py-6 rounded-full font-black uppercase text-xs shadow-2xl hover:bg-cyan-400 transition-all active:scale-95"
              >
                Confirm Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </main>
  )
}
