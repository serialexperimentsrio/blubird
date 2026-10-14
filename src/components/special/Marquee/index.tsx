import { FC } from 'react';

interface MarqueeProps {
  text: string;
  speed?: number;
}

// Text is repeated 6 times; the `marquee` keyframes in globals.css scroll one copy's width
const Marquee: FC<MarqueeProps> = ({ text, speed = 50 }) => {
  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="marquee-text" style={{ animationDuration: `${speed}s` }}>
        {text.repeat(6)}
      </div>
    </div>
  );
};

export default Marquee;
