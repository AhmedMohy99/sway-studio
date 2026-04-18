'use client'
import React, { useRef, useState, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

export default function TryOnEngine({ itemUrl }: { itemUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<any>(null);

  // Load the AI "Eyes"
  useEffect(() => {
    const loadAI = async () => {
      const model = poseDetection.SupportedModels.MoveNet;
      const config = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
      setDetector(await poseDetection.createDetector(model, config));
    };
    loadAI();
  }, []);

  // Start the Camera and Look for the Body
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      detectBody();
    }
  };

  const detectBody = async () => {
    if (detector && videoRef.current && canvasRef.current) {
      const poses = await detector.estimatePoses(videoRef.current);
      const ctx = canvasRef.current.getContext('2d');
      if (poses.length > 0 && ctx) {
        const keypoints = poses[0].keypoints;
        const leftS = keypoints.find((k: any) => k.name === 'left_shoulder');
        const rightS = keypoints.find((k: any) => k.name === 'right_shoulder');

        if (leftS && rightS && leftS.score > 0.5) {
          drawHoodie(ctx, leftS, rightS);
        }
      }
      requestAnimationFrame(detectBody);
    }
  };

  const drawHoodie = (ctx: CanvasRenderingContext2D, ls: any, rs: any) => {
    const img = new Image();
    img.src = itemUrl;
    
    // Calculate size based on distance between shoulders
    const shoulderWidth = Math.abs(ls.x - rs.x) * 2.8; 
    const x = (ls.x + rs.x) / 2 - shoulderWidth / 2;
    const y = (ls.y + rs.y) / 2 - (shoulderWidth * 0.2);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, x, y, shoulderWidth, shoulderWidth * 1.1);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <button onClick={startCamera} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold uppercase text-xs">
        Try It On
      </button>
    </div>
  );
}
