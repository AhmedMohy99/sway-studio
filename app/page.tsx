'use client'
import TryOnEngine from '@/components/TryOnEngine'
import { useState } from 'react'

const COLLECTION = [
  { id: 1, name: 'Charcoal Rogue Hoodie', price: '1500', img: 'https://www.swaymaverick.com/charcoal.jpg' },
  { id: 2, name: 'Ice Blue Rogue Hoodie', price: '1500', img: 'https://www.swaymaverick.com/blue.jpg' },
  { id: 3, name: 'Dust Rose Rogue Hoodie', price: '1500', img: 'https://www.swaymaverick.com/pink.jpg' }
];

export default function Home() {
  const [activeProduct, setActiveProduct] = useState(COLLECTION[0]);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="p-8 border-b border-white/5 flex justify-between items-center">
        <h1 className="text-3xl font-black italic tracking-tighter">SWAY MAVERICK</h1>
        <span className="text-[10px] bg-zinc-800 px-3 py-1 rounded-full uppercase">Urban Fossils Collection</span>
      </header>

      <div className="grid lg:grid-cols-2 min-h-[80vh]">
        {/* Left: The Trial Area */}
        <div className="p-8 flex items-center justify-center border-r border-white/5">
           <TryOnEngine itemUrl={activeProduct.img} />
        </div>

        {/* Right: The Product Selection */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-6xl font-bold mb-6 tracking-tighter uppercase italic">{activeProduct.name}</h2>
          <p className="text-2xl text-zinc-400 mb-10">EGP {activeProduct.price}.00</p>

          <div className="grid grid-cols-3 gap-4 mb-12">
            {COLLECTION.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveProduct(item)}
                className={`aspect-square border-2 rounded-xl overflow-hidden transition-all ${activeProduct.id === item.id ? 'border-white' : 'border-transparent opacity-50'}`}
              >
                <img src={item.img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <button className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform">
            Pre-Order Now
          </button>
        </div>
      </div>
    </main>
  );
}
