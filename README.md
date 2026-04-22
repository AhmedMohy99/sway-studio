# SWAY STUDIO - AI Virtual Try-On System

A production-ready, high-performance virtual try-on platform for streetwear built with Next.js 14, MediaPipe, and Tailwind CSS.

## 🚀 Features

- **Real-time AI Pose Detection**: MediaPipe-powered shoulder tracking for accurate garment placement
- **Dual Mode Try-On**: Live camera feed or photo upload
- **Dynamic Size Scaling**: S to 2XL with proportional scaling (88% - 122%)
- **Multi-Variant Support**: Color switching without page reload
- **WhatsApp Integration**: Direct order placement
- **Optimized for Vercel Free Tier**: Client-side rendering, zero server costs

## 📁 Project Structure

```
sway-studio/
├── app/
│   ├── page.tsx              # Main UI with modal system
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Tailwind styles
├── components/
│   ├── TryOnEngine.tsx       # Core AR engine
│   └── SizeGuide.tsx         # Size chart modal
├── lib/
│   └── products.ts           # Product data & types
└── public/
    ├── maverick-phoenix-black.png
    ├── maverick-phoenix-white.png
    ├── powder-blue-venture-tee.png
    ├── catalyst-tee.png
    ├── bluish-splash.png
    ├── yellowish-splash.png
    ├── greenish-splash.png
    ├── cyber-crescent.png
    ├── black-flux-sweatpants.png
    ├── light-code-sweatpants.png
    ├── eternity-protocol-white.png
    └── eternity-protocol-navy.png
```

## 🔧 Technical Implementation

### Key Optimizations

1. **Parallel Initialization**: Camera and MediaPipe load simultaneously
2. **Image Preloading**: Garment PNGs load before render loop
3. **State Management**: Refs prevent unnecessary re-renders
4. **Memory Management**: Proper cleanup of video streams and animation frames
5. **Error Handling**: Graceful fallbacks for permissions and HTTPS

### Size Scaling Logic

```typescript
const SIZE_SCALE: Record<string, number> = {
  S: 0.88,    // -12% from base
  M: 0.96,    // -4% from base
  L: 1.04,    // +4% from base (default)
  XL: 1.13,   // +13% from base
  '2XL': 1.22 // +22% from base
}
```

### Garment Placement Algorithm

```typescript
// Shoulder width detection
const shoulderW = Math.sqrt(Math.pow(rsx - lsx, 2) + Math.pow(rsy - lsy, 2))

// Torso height (shoulder to hip)
const torsoH = Math.abs(hipY - cy)

// Garment dimensions with size multiplier
const gw = shoulderW * 2.2 * scale  // 2.2x shoulder width
const gh = torsoH * 2.6 * scale     // 2.6x torso height

// Position: 15% below shoulder center
const posY = cy + (torsoH * 0.15)
```

## 🖼️ Image Asset Requirements

All garment overlay images must be:

- **Format**: PNG with transparency
- **Resolution**: 1000x1500px minimum
- **Background**: Fully transparent
- **Alignment**: Centered vertically and horizontally
- **Naming**: Lowercase with hyphens (e.g., `maverick-phoenix-black.png`)

### Creating Overlay Images

1. Photograph garment flat on white background
2. Remove background in Photoshop/GIMP
3. Ensure edges are clean (no color fringing)
4. Save as PNG-24 with transparency
5. Optimize with TinyPNG or ImageOptim

## 🚀 Deployment

### Vercel Setup

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Environment Variables** (if needed):
```bash
# None required for client-side rendering
```

### Required Vercel Configuration

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install"
}
```

## 🔒 Security & Privacy

- **HTTPS Required**: Camera access only works on HTTPS or localhost
- **No Server Upload**: All image processing happens client-side
- **No Data Storage**: No user photos are uploaded or stored
- **Browser Permissions**: Explicit camera permission request

## ⚡ Performance Benchmarks

- **First Paint**: < 1.2s
- **Camera Init**: < 2s
- **MediaPipe Load**: < 3s
- **Frame Rate**: 30 FPS (1280x720)
- **Memory Usage**: ~150MB (stable)

## 🐛 Troubleshooting

### Black Screen Issue
**Cause**: Video not ready before render loop starts  
**Solution**: Wait for both `cameraReady` and `mediapipeReady` states

### "Step back" Message Persists
**Cause**: Poor lighting or shoulder visibility < 50%  
**Solution**: Ask user to move to well-lit area, face camera directly

### Garment Not Mirrored Correctly
**Cause**: Canvas scaling applied incorrectly  
**Solution**: Mirror background first, then draw garment with inverse transform

### Build Error: "Export not found"
**Cause**: Named exports not declared in `products.ts`  
**Solution**: Ensure all exports use `export const` or `export type`

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Safari | 15+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Mobile Safari | iOS 15+ | ✅ Full Support |
| Mobile Chrome | Android 10+ | ✅ Full Support |

## 🔄 Future Enhancements

- [ ] Multi-pose support (side view, back view)
- [ ] Video recording of try-on session
- [ ] AI-powered size recommendation
- [ ] Virtual background replacement
- [ ] Social sharing (Instagram/TikTok)
- [ ] Analytics dashboard

## 📞 Support

- **WhatsApp**: +20 103 386 6838
- **Instagram**: [@swaymaverick](https://instagram.com/swaymaverick)

## 📄 License

Proprietary - SWAY STUDIO 2024

---

Built with 🔥 by the SWAY STUDIO team
