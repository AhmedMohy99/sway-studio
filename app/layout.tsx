import './globals.css'

export const metadata = {
  title: 'Sway Studio | Virtual Try-On',
  description: 'Premium Streetwear Fitting Room',
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
