import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SWAY STUDIO | AERO Collection',
  description: 'AI Powered Virtual Fitting Room',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
