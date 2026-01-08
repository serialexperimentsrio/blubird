import './globals.css'
import { metadata } from './metadata'
import DitherBackground from '@/components/DitherBackground'

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {/* Dithering background (representing clouds under a blue sky!) */}
        <DitherBackground />

        {/* Language-specific content with transitions */}
        <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
          {children}
        </div>
      </body>
    </html>
  )
}