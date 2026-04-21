'use client'

import { useEffect, useRef, useState } from 'react'
import {
  FilesetResolver,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'

interface TryOnProps {
  itemUrl: string
  selectedSize?: string
  productName?: string
}

const SIZE_SCALE: Record<string, number> = {
  S: 0.9,
  M: 1,
  L: 1.05,
  XL: 1.12,
  '2XL': 1.2,
}

export default function TryOnEngine({
  itemUrl,
  selectedSize = 'L',
  productName,
}: TryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poseRef = useRef<PoseLandmarker | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [poseDetected, setPoseDetected] = useState(false)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        setLoading(true)
        setError(null)

        // 🚨 HTTPS CHECK
        if (
          location.protocol !== 'https:' &&
          location.hostname !== 'localhost'
        ) {
          throw new Error('Camera requires HTTPS or localhost')
        }

        // Load AI
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        const pose = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })

        poseRef.current = pose

        // Load PNG
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = itemUrl

        await new Promise((res, rej) => {
          img.onload = res
          img.onerror = () => rej('Image failed to load')
        })

        imageRef.current = img

        // Camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })

        streamRef.current = stream

        if (!videoRef.current) return

        videoRef.current.srcObject = stream

        await videoRef.current.play().catch(() => {})

        if (!mounted) return

        setLoading(false)
        loop()
      } catch (e: any) {
        setError(e.message)
        setLoading(false)
      }
    }

    const loop = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const pose = poseRef.current
      const img = imageRef.current

      if (!video || !canvas || !pose || !img) {
        requestAnimationFrame(loop)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const w = video.videoWidth
      const h = video.videoHeight

      if (!w || !h) {
        requestAnimationFrame(loop)
        return
      }

      canvas.width = w
      canvas.height = h

      ctx.clearRect(0, 0, w, h)

      ctx.save()
      ctx.translate(w, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, w, h)

      const res = pose.detectForVideo(video, performance.now())

      if (res.landmarks?.length) {
        const lm = res.landmarks[0]

        const ls = lm[11]
        const rs = lm[12]
        const lh = lm[23]
        const rh = lm[24]

        if (ls && rs && lh && rh) {
          setPoseDetected(true)

          const scale = SIZE_SCALE[selectedSize] || 1

          const sw = Math.abs(rs.x - ls.x) * w
          const sh = ((lh.y + rh.y) / 2 - (ls.y + rs.y) / 2) * h

          const cx = ((ls.x + rs.x) / 2) * w
          const cy = ((ls.y + rs.y) / 2) * h

          const gw = sw * 2 * scale
          const gh = sh * 2.3 * scale

          ctx.drawImage(img, cx - gw / 2, cy - gh / 3, gw, gh)
        } else {
          setPoseDetected(false)
        }
      }

      ctx.restore()
      requestAnimationFrame(loop)
    }

    init()

    return () => {
      mounted = false
      streamRef.current?.getTracks().forEach((t) => t.stop())
      poseRef.current?.close()
    }
  }, [itemUrl, selectedSize])

  return (
    <div className="mt-6">
      {loading && <p className="text-cyan-400 text-xs">Starting camera...</p>}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {!poseDetected && !loading && !error && (
        <p className="text-yellow-400 text-xs">
          Show shoulders clearly
        </p>
      )}

      <div className="w-full aspect-[3/4] bg-black rounded-xl overflow-hidden">
        <video ref={videoRef} className="hidden" autoPlay playsInline />
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  )
}
