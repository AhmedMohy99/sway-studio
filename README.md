# SWAY STUDIO | AI-Powered Virtual Fitting Room

Sway Studio is a high-performance, AI-driven e-commerce platform designed for **Sway Maverick**. It features a virtual fitting room that bridges the gap between digital browsing and physical fit, using body calibration metrics and cloud-based image processing.

The system uses a custom-built capture engine to collect user metrics (height and weight) and passes them alongside a public Vercel Blob image URL directly to the Sway fulfillment team via WhatsApp for AI rendering.

## 🚀 Core Features

* **Virtual Fitting Engine:** Real-time subject capture via camera or high-resolution upload, optimized with browser-side compression.
* **Body Calibration:** Captures user height (cm) and weight (kg) to map against the official Sway Maverick size guide (e.g., ensuring an 'L' is correctly oversized).
* **Vercel Blob Integration:** High-speed, public cloud storage for customer reference photos.
* **WhatsApp Fulfillment Loop:** Automated hand-off of customer metrics and photos to the design team (via `201016286261`) for final AI rendering.
* **Modern UI:** Aesthetic-driven interface using Tailwind CSS, featuring dark mode, cyan accents, and Framer Motion animations.

## 🛠 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript / React
* **Styling:** Tailwind CSS
* **Storage:** Vercel Blob (@vercel/blob)
* **Communication:** WhatsApp Business API (URL-based triggers)
