import './globals.css'
import { metadata } from './metadata'
import DitherBackground from '@/components/special/Dither/Background'

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/x12y16pxMaruMonica.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        {/* Font is preloaded and uses `font-display: swap` in globals.css to avoid FOIT. */}
      </head>
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