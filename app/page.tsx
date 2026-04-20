'use client'
import TryOnEngine from '@/components/TryOnEngine'

export default function ProductPage() {
  const whatsappNumber = "201016286261";
  const preorderMessage = "Hi! I want help choosing a Sway Maverick piece.";
  
  const handlePreorder = () => {
    const encodedMessage = encodeURIComponent(preorderMessage);
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      {/* Product Header */}
      <div className="text-center mb-8 mt-12">
        <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-2">
          ETERNITY PROTOCOL
        </h1>
        <p className="text-cyan-400 font-black italic">EGP 730.00</p>
      </div>

      {/* AI Fitting Engine Component */}
      <div className="w-full max-w-md">
         <TryOnEngine 
            productName="Eternity Protocol" 
            selectedSize="L" 
            itemUrl="/path-to-hoodie-image.png" 
         />
      </div>

      {/* THE FIXED PREORDER BUTTON */}
      <div className="w-full max-w-md mt-8 pb-12">
        <button 
          onClick={handlePreorder}
          className="w-full bg-white text-black py-6 rounded-full font-[1000] uppercase tracking-[0.2em] text-sm hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
        >
          Confirm Preorder
        </button>
      </div>
    </main>
  )
}
