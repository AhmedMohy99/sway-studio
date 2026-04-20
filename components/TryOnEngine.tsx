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
    } catch (err) { alert("Camera access denied.") }
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
    if (!height || !weight || !userImage) return alert("Missing metrics.")
    setStep('uploading') 
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: userImage }),
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server Error ${response.status}`);
      }

      const uploadData = await response.json()
      
      const message = `*SWAY STUDIO AI FITTING*%0A%0A` +
                      `*Product:* ${productName}%0A` +
                      `*Size:* ${selectedSize}%0A` +
                      `*Height:* ${height}cm | *Weight:* ${weight}kg%0A%0A` +
                      `*Photo:* ${uploadData.url}`;

      window.open(`https://api.whatsapp.com/send?phone=201033866838&text=${message}`, '_blank');
      setStep('success')

    } catch (error: any) {
      console.error(error)
      alert(`FIX THIS: ${error.message}. Make sure BLOB_READ_WRITE_TOKEN is in Vercel Settings.`);
      setStep('capture')
    }
  }

  return (
    <div className="w-full mt-6">
      {step === 'capture' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-6 flex flex-col items-center">
          <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                <button onClick={takePhoto} className="absolute bottom-6 w-16 h-16 bg-white rounded-full border-4 border-cyan-400" />
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <button onClick={startCamera} className="bg-cyan-400 text-black px-8 py-4 rounded-full font-black uppercase text-[10px]">Open Camera</button>
                <label className="border border-zinc-700 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] text-center cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'metrics' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <input type="number" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} className="bg-black border border-white/10 rounded-xl p-4 text-white outline-none" />
            <input type="number" placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-black border border-white/10 rounded-xl p-4 text-white outline-none" />
          </div>
          <button onClick={handleGenerate} className="w-full bg-cyan-400 text-black py-5 rounded-full font-black uppercase">Generate AI Fitting</button>
        </div>
      )}

      {step === 'uploading' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-12 flex flex-col items-center">
          <div className="w-12 h-12 border-t-4 border-cyan-400 rounded-full animate-spin mb-4" />
          <p className="text-cyan-400 font-black italic uppercase">Syncing Metrics...</p>
        </div>
      )}

      {step === 'success' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-8 text-center">
          <h3 className="text-xl font-black text-white uppercase mb-4">Request Sent!</h3>
          <button onClick={() => setStep('capture')} className="text-zinc-500 uppercase font-black text-[10px]">Try Another</button>
        </div>
      )}
    </div>
  )
}
