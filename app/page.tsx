import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white mb-2">
          SWAY MAVERICK
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">
          Virtual Fitting Room • Collection 2026
        </p>
      </div>

      {/* The AI Fitting Room */}
      <TryOnEngine itemUrl="https://www.swaymaverick.com/path-to-your-hoodie-image.jpg" />

      <div className="mt-10 max-w-xs text-center">
        <p className="text-zinc-400 text-xs leading-relaxed uppercase tracking-widest">
          Stand 2 meters back from the camera for the best fit. 
          The AI will automatically align the hoodie to your shoulders.
        </p>
      </div>
    </main>
  )
}
