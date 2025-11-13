'use client'

import Dither from '@/components/Special/Dither'

export default function DitherBackground() {
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
      <Dither enableMouseInteraction={true} mouseRadius={0.4} />
    </div>
  )
}
