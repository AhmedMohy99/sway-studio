'use client'
import React, { useRef, useState, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

export default function Sway3DEngine({ itemUrl, userStats }: { itemUrl: string, userStats: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<any>(null);
  const [suggestedSize, setSuggestedSize] = useState<string | number>('--');

  useEffect(() => {
    const init = async () => {
      const model = poseDetection.SupportedModels.MoveNet;
      setDetector(await poseDetection.createDetector(model, { modelType: 'SINGLEPOSE_LIGHTNING' }));
    };
    init();
  }, []);

  const detect = async () => {
    if (detector && videoRef.current && canvasRef.current) {
      const poses = await detector.estimatePoses(videoRef.current);
      const ctx = canvasRef.current.getContext('2d');
      if (poses.length > 0 && ctx) {
        const kp = poses[0].keypoints;
        const ls = kp.find((k: any) => k.name === 'left_shoulder');
        const rs = kp.find((k: any) => k.name === 'right_shoulder');

        if (ls && rs && ls.score > 0.5) {
          // AI CALCULATION FOR SIZE
          const pixelWidth = Math.abs(ls.x - rs.x);
          calculateSize(pixelWidth);
          draw3DOverlay(ctx, ls, rs, pixelWidth);
        }
      }
      requestAnimationFrame(detect);
    }
  };

  const calculateSize = (pWidth: number) => {
    // Logic: If user width is X, then Size is Y.
    // This is where we use your images' logic (34cm, 36cm, etc.)
    if (userStats.width < 35) setSuggestedSize(1);
    else if (userStats.width < 37) setSuggestedSize(2);
    else if (userStats.width < 39) setSuggestedSize(3);
    else setSuggestedSize(4);
  };

  const draw3DOverlay = (ctx: CanvasRenderingContext2D, ls: any, rs: any, pWidth: number) => {
    const img = new Image();
    img.src = itemUrl;
    const drawW = pWidth * 2.8; 
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Add shadow and glow to make it look "3D" and "Real"
    ctx.shadowBlur = 20;
    ctx.shadowColor = "black";
    ctx.drawImage(img, (ls.x + rs.x)/2 - drawW/2, (ls.y + rs.y)/2 - (drawW * 0.15), drawW, drawW * 1.2);
  };

  return (
    <div className="relative w-full aspect-[3/4] rounded-[30px] overflow-hidden group border border-white/5">
      <video ref={videoRef} autoPlay playsInline onLoadedData={detect} className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Your Fit</p>
        <p className="text-2xl font-black italic">SIZE {suggestedSize}</p>
      </div>
    </div>
  );
}
