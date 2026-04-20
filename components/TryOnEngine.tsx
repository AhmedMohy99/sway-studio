'use client'

import { useEffect, useRef, useState } from 'react'
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

interface TryOnProps {
  itemUrl: string
  selectedSize?: string
  productName?: string
}

const SIZE_SCALE: Record<string, number> = {
  S: 0.9,
  M: 1,
  L: 1.08,
  XL: 1.16,
  '2XL': 1.24,
}

export default function TryOnEngine({
  itemUrl,
  selectedSize = 'L',
  productName = 'Sway Maverick Item',
}: TryOnProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)
  const garmentImageRef = useRef<HTMLImageElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastVideoTimeRef = useRef(-1)

  const [isLoading, setIsLoading] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)

  useEffect(() => {
    let mounted = true
    let mediaStream: MediaStream | null = null

    const loadEngine = async () => {
      try {
        setIsLoading(true)
        setCameraError(null)

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })

        poseLandmarkerRef.current = poseLandmarker

        const garmentImage = new Image()
        garmentImage.crossOrigin = 'anonymous'
        garmentImage.src = itemUrl

        await new Promise<void>((resolve, reject) => {
          garmentImage.onload = () => resolve()
          garmentImage.onerror = () =>
            reject(
              new Error(
                'Garment image failed to load. Use a valid transparent PNG path.'
              )
            )
        })

        garmentImageRef.current = garmentImage

        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })

        if (!videoRef.current) return

        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()

        if (!mounted) return

        setIsCameraReady(true)
        setIsLoading(false)
        renderFrame()
      } catch (error: any) {
        console.error(error)
        setCameraError(
          error?.message ||
            'Could not start the live fitting engine. Please allow camera access.'
        )
        setIsLoading(false)
      }
    }

    const renderFrame = async () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const poseLandmarker = poseLandmarkerRef.current
      const garmentImage = garmentImageRef.current

      if (!video || !canvas || !poseLandmarker || !garmentImage) {
        animationFrameRef.current = requestAnimationFrame(renderFrame)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        animationFrameRef.current = requestAnimationFrame(renderFrame)
        return
      }

      const width = video.videoWidth
      const height = video.videoHeight

      if (!width || !height) {
        animationFrameRef.current = requestAnimationFrame(renderFrame)
        return
      }

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      ctx.clearRect(0, 0, width, height)

      // mirror preview like selfie camera
      ctx.save()
      ctx.translate(width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, width, height)

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime

        const results = poseLandmarker.detectForVideo(video, performance.now())

        if (results.landmarks && results.landmarks.length > 0) {
          const lm = results.landmarks[0]

          const leftShoulder = lm[11]
          const rightShoulder = lm[12]
          const leftHip = lm[23]
          const rightHip = lm[24]

          if (leftShoulder && rightShoulder && leftHip && rightHip) {
            const lsx = leftShoulder.x * width
            const lsy = leftShoulder.y * height
            const rsx = rightShoulder.x * width
            const rsy = rightShoulder.y * height
            const lhx = leftHip.x * width
            const lhy = leftHip.y * height
            const rhx = rightHip.x * width
            const rhy = rightHip.y * height

            const shoulderCenterX = (lsx + rsx) / 2
            const shoulderCenterY = (lsy + rsy) / 2
            const hipCenterY = (lhy + rhy) / 2

            const shoulderWidth = Math.abs(rsx - lsx)
            const torsoHeight = Math.abs(hipCenterY - shoulderCenterY)
            const bodyAngle = Math.atan2(rsy - lsy, rsx - lsx)

            const scale = SIZE_SCALE[selectedSize] || 1

            const garmentWidth = shoulderWidth * 2.05 * scale
            const garmentHeight = torsoHeight * 2.45 * scale

            ctx.save()
            ctx.translate(
              shoulderCenterX,
              shoulderCenterY + torsoHeight * 0.22
            )
            ctx.rotate(-bodyAngle)

            ctx.drawImage(
              garmentImage,
              -garmentWidth / 2,
              -garmentHeight / 3,
              garmentWidth,
              garmentHeight
            )

            ctx.restore()
          }
        }
      }

      ctx.restore()
      animationFrameRef.current = requestAnimationFrame(renderFrame)
    }

    loadEngine()

    return () => {
      mounted = false

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close()
      }

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }

      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [itemUrl, selectedSize])

  return (
    <div className="w-full mt-6">
      <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Live AI Fitting
            </p>
            <h3 className="text-sm md:text-base font-[1000] uppercase text-white tracking-tight">
              {productName}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-[1000] text-sm shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            {selectedSize}
          </div>
        </div>

        {isLoading && (
          <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-center">
            <p className="text-[10px] uppercase font-black tracking-widest text-cyan-400 animate-pulse">
              Starting camera and fitting engine...
            </p>
          </div>
        )}

        {cameraError && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center">
            <p className="text-[10px] uppercase font-black tracking-wide text-red-400">
              {cameraError}
            </p>
            <p className="text-[10px] text-zinc-500 mt-2">
              Make sure camera permission is allowed and the site runs on
              localhost or HTTPS.
            </p>
          </div>
        )}

        <div className="relative w-full aspect-[3/4] bg-black rounded-[24px] overflow-hidden border border-zinc-800">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="hidden"
          />
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />

          {!isCameraReady && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-14 h-14 border-t-4 border-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Preparing studio
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-white/5 bg-black/40 p-4">
          <p className="text-[10px] uppercase font-black tracking-[0.25em] text-zinc-500 mb-2">
            Best Result Tips
          </p>
          <ul className="text-[11px] text-zinc-400 space-y-1 leading-relaxed">
            <li>• Stand centered in front of the camera</li>
            <li>• Keep shoulders and upper body visible</li>
            <li>• Use a transparent PNG product image</li>
            <li>• Good lighting improves the fit alignment</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
