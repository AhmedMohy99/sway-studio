import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SWAY STUDIO',
  description: 'AI-Powered Streetwear Fitting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">{children}</body>
    </html>
  )
}
