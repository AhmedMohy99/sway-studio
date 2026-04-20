'use client'
import { useState, useRef, useEffect } from 'react'

interface TryOnProps {
  itemUrl: string;
  selectedSize?: string;
  productName?: string;
}

export default function TryOnEngine({ itemUrl, selectedSize = "L", productName = "Sway Studio Item" }: TryOnProps) {
  const [step, setStep] = useState<'capture' | 'metrics' | 'uploading' | 'success'>('capture')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  useEffect(() => { return () => stopCamera() }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) { alert("Camera access denied. Use upload.") }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const scale = 800 / video.videoWidth;
      canvas.width = 800;
      canvas.height = video.videoHeight * scale;
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        setUserImage(canvas.toDataURL('image/jpeg', 0.6))
        stopCamera()
        setStep('metrics')
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 800; canvas.height = (img.height / img.width) * 800;
            canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
            setUserImage(canvas.toDataURL('image/jpeg', 0.6));
            setStep('metrics');
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!height || !weight || !userImage) return alert("Please enter height and weight.")
    setStep('uploading') 
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: userImage }),
      })
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Connection error");
      }

      // Format WhatsApp message with the Public URL
      const message = `*NEW SWAY FITTING REQUEST*%0A%0A` +
                      `*Product:* ${productName}%0A` +
                      `*Size:* ${selectedSize}%0A` +
                      `*User Metrics:* ${height}cm, ${weight}kg%0A%0A` +
                      `*User Photo:* ${result.url}`;

      window.open(`https://api.whatsapp.com/send?phone=201033866838&text=${message}`, '_blank');
      setStep('success')

    } catch (error: any) {
      console.error(error)
      alert(`CRITICAL ERROR: ${error.message}`);
      setStep('capture')
    }
  }

  return (
    <div className="w-full mt-6">
      {/* CAPTURE */}
      {step === 'capture' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-6 flex flex-col items-center">
          <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                <button onClick={takePhoto} className="absolute bottom-6 w-16 h-16 bg-white rounded-full border-4 border-cyan-400 shadow-xl" />
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <button onClick={startCamera} className="bg-cyan-400 text-black px-10 py-4 rounded-full font-black uppercase text-[10px]">Open Camera</button>
                <label className="border border-zinc-700 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] text-center cursor-pointer">
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* METRICS */}
      {step === 'metrics' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">3. Body Calibration</p>
            <button onClick={() => { setStep('capture'); setUserImage(null); }} className="text-[9px] text-zinc-500 uppercase font-black">Retake</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-cyan-400 outline-none" />
            <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-cyan-400 outline-none" />
          </div>
          <button onClick={handleGenerate} className="w-full bg-cyan-400 text-black py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-lg">Generate AI Fitting</button>
        </div>
      )}

      {/* LOADING */}
      {step === 'uploading' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-16 flex flex-col items-center">
          <div className="w-12 h-12 border-t-4 border-cyan-400 rounded-full animate-spin mb-6" />
          <h3 className="text-cyan-400 font-black italic uppercase animate-pulse">Syncing Metrics...</h3>
        </div>
      )}

      {/* SUCCESS */}
      {step === 'success' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-10 text-center animate-in fade-in zoom-in">
          <div className="w-16 h-16 bg-cyan-400 text-black rounded-full flex items-center justify-center text-2xl mx-auto mb-4 font-black">✓</div>
          <h3 className="text-xl font-black text-white uppercase mb-2">Request Sent!</h3>
          <p className="text-[10px] text-zinc-400 uppercase font-bold mb-6">Check WhatsApp for your AI render.</p>
          <button onClick={() => setStep('capture')} className="text-zinc-500 font-black uppercase text-[10px] border border-white/10 px-6 py-2 rounded-full">Try Another</button>
        </div>
      )}
    </div>
  )
}
