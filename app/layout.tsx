// globals.css first: it sets the cascade layer order that paiger's CSS slots into
import './globals.css'
import 'paiger/styles.css'
import type { Metadata } from 'next'
import { PaigerProvider } from 'paiger'
import DitherBackground from '@/components/special/Dither/Background'

export const metadata: Metadata = {
  title: "理央の世界〜! • RIO'S WORLD!",
  icons: '/icon.png',
}

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

        {/* Language-specific content with transitions. The provider renders
            paiger's modals and toasts inside the app, so they share its context. */}
        <PaigerProvider>
          <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
            {children}
          </div>
        </PaigerProvider>
      </body>
    </html>
  )
}
