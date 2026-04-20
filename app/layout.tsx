import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SWAY STUDIO | AI Streetwear Fitting',
  description: 'AI-Powered Streetwear Fitting for Sway Maverick',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased selection:bg-cyan-400 selection:text-black">
        {children}
      </body>
    </html>
  )
}
