import { FC } from 'react';

interface MarqueeProps {
  text: string;
  speed?: number;
}

const Marquee: FC<MarqueeProps> = ({ text, speed = 50 }) => {
  const duration = `${speed}s`;

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
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-1 * ${100 / 6}%));
          }
        }

        .marquee-text {
          animation: marquee ${duration} linear infinite;
          display: inline-block;
        }
      `}</style>
      <div className="marquee-text">
        {text}{text}{text}{text}{text}{text}
      </div>
    </div>
  );
};

export default Marquee;
