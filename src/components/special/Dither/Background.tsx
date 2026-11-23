'use client'

import dynamic from 'next/dynamic'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const Dither = dynamic(() => import('@/components/special/Dither'), { ssr: false })

export default function Background() {
  // Bigger 3px blocks on very wide screens: the wave noise runs once per block,
  // so this cuts its work by about half where there are the most blocks
  const { width } = useBreakpoint()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Background is the site blue (--pg-color-main). The shader mixes in linear light,
          so the wave grey has to be this bright to match the old three.js version's strength */}
      <Dither backgroundColor="#0021f5" waveColor="#c8c8c8" mouseRadius={0.4} pixelSize={width > 2200 ? 3 : 2} />
    </div>
  )
}
