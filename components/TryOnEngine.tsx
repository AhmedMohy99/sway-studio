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
    } catch (err) { alert("Camera access denied. Please use the upload option.") }
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
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const base64Data = canvas.toDataURL('image/jpeg', 0.8) 
        setUserImage(base64Data)
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
        setUserImage(reader.result as string)
        setStep('metrics')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!height || !weight || !userImage) return alert("Missing data.")
    setStep('uploading') 
    
    try {
      // 1. Upload the photo to Vercel Blob
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: userImage })
      })
      
      const uploadData = await uploadResponse.json()
      
      if (!uploadData.url) throw new Error("Cloud upload failed")

      // 2. Format the WhatsApp Message
      const message = `*NEW VIRTUAL FITTING REQUEST*%0A%0A` +
                      `*Item:* ${productName}%0A` +
                      `*Size Requested:* ${selectedSize}%0A` +
                      `*Customer Height:* ${height} cm%0A` +
                      `*Customer Weight:* ${weight} kg%0A%0A` +
                      `*Customer Photo:* ${uploadData.url}%0A%0A` +
                      `Please generate my fitting!`;

      // 3. Open WhatsApp (Using your Sway Maverick number)
      const whatsappNumber = "201033866838"; 
      window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`, '_blank');

      // 4. Show Success Screen
      setStep('success')

    } catch (error) {
      console.error(error)
      alert("Network Error saving image. Please try again.")
      setStep('capture')
    }
  }

  return (
    <div className="w-full mt-6">
      
      {/* CAPTURE STEP */}
      {step === 'capture' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-6 flex flex-col items-center">
          <p className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.3em] mb-4">2. Subject Capture</p>
          <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-dashed border-zinc-700 flex items-center justify-center">
            
            {isCameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                <button onClick={takePhoto} className="absolute bottom-6 w-16 h-16 bg-white rounded-full border-4 border-cyan-400 shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-transform hover:scale-95 active:scale-90" />
              </>
            ) : (
              <div className="flex flex-col items-center p-6 w-full max-w-[200px]">
                <button onClick={startCamera} className="bg-cyan-400 text-black w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-300 transition-colors mb-4 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                  Open Camera
                </button>
                <p className="text-zinc-600 text-[9px] uppercase font-bold tracking-widest mb-4">OR</p>
                <label className="border border-zinc-700 hover:border-cyan-400 text-white w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer text-center transition-colors">
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* METRICS STEP */}
      {step === 'metrics' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.3em]">3. Body Calibration</p>
            <button onClick={() => { setStep('capture'); setUserImage(null); }} className="text-[9px] uppercase tracking-widest text-zinc-500 hover:text-white font-bold">Retake</button>
          </div>
          <div className="flex gap-4 mb-8">
            {userImage && <img src={userImage} className="w-20 h-24 object-cover rounded-xl border border-white/20" alt="User" /> }
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div><input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm focus:border-cyan-400 outline-none" /></div>
            <div><input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm focus:border-cyan-400 outline-none" /></div>
          </div>
          <button onClick={handleGenerate} className="w-full bg-cyan-400 text-black py-5 rounded-full text-xs font-[1000] uppercase tracking-widest shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:scale-[0.98] transition-transform">
            Send Fitting Request
          </button>
        </div>
      )}

      {/* UPLOADING STEP */}
      {step === 'uploading' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-12 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-[1000] italic text-cyan-400 uppercase tracking-tighter animate-pulse">Securing Link...</h3>
        </div>
      )}

      {/* SUCCESS STEP */}
      {step === 'success' && (
        <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-cyan-400/20 text-cyan-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-cyan-400">✓</div>
          <h3 className="text-xl font-[1000] italic text-white mb-2 uppercase">Request Sent!</h3>
          <p className="text-[10px] text-zinc-400 tracking-widest mb-6 uppercase font-bold leading-relaxed">
            Please check your WhatsApp.<br/>Our team is generating your AI fitting right now.
          </p>
          <button onClick={() => setStep('capture')} className="text-[10px] font-black tracking-widest text-zinc-500 uppercase hover:text-white border border-white/10 px-6 py-3 rounded-full transition-colors">
            Start Over
          </button>
        </div>
      )}
    </div>
  )
}
