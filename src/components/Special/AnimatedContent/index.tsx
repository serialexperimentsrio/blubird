import React, { useRef, useEffect, ReactNode } from 'react';

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  onComplete?: () => void;
  isVisible?: boolean;
  useScrollTrigger?: boolean;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'cubic-bezier(0.16, 1, 0.3, 1)',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
  isVisible,
  useScrollTrigger = true
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // State-driven animation (triggered by isVisible prop)
  useEffect(() => {
    if (isVisible === undefined || useScrollTrigger) return;

    const el = ref.current;
    if (!el) return;

    // Kill any existing animations
    if (el.getAnimations) {
      el.getAnimations().forEach(animation => animation.cancel());
    }

    const isAxis = direction === 'horizontal' ? 'X' : 'Y';
    const offset = reverse ? -distance : distance;

    if (!isVisible) {
      // Set to initial state (no animation needed)
      el.style.transform = `translate${isAxis}(${offset}px)`;
      el.style.opacity = String(animateOpacity ? initialOpacity : 1);
      return;
    }

    // Build keyframes for animation starting from the initial offset state
    const keyframes: Keyframe[] = [
      {
        transform: `translate${isAxis}(${offset}px)`,
        opacity: animateOpacity ? initialOpacity : 1,
        offset: 0
      },
      {
        transform: `translate${isAxis}(0px) scale(1)`,
        opacity: 1,
        offset: 1
      }
    ];

    const animationOptions: KeyframeAnimationOptions = {
      duration: duration * 1000,
      easing: ease,
      delay: delay * 1000,
      fill: 'forwards',
      composite: 'replace'
    };

    // Start animation, browser's Web Animations API handles the timing better than requestAnimationFrame
    const animation = el.animate(keyframes, animationOptions);

    animation.onfinish = () => {
      if (onComplete) {
        onComplete();
      }
    };

    return () => {
      if (el.getAnimations) {
        el.getAnimations().forEach(animation => animation.cancel());
      }
    };
  }, [isVisible, useScrollTrigger, distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, delay, onComplete]);

  // Scroll-triggered animation (original behavior)
  useEffect(() => {
    if (isVisible !== undefined || !useScrollTrigger) return;

    const el = ref.current;
    if (!el) return;

    // Set initial state
    const isAxis = direction === 'horizontal' ? 'X' : 'Y';
    const offset = reverse ? -distance : distance;

    el.style.transform = `translate${isAxis}(${offset}px) scale(${scale})`;
    el.style.opacity = String(animateOpacity ? initialOpacity : 1);

    // Create intersection observer for scroll trigger
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Kill any existing animations
          if (el.getAnimations) {
            el.getAnimations().forEach(animation => animation.cancel());
          }

          const keyframes: Keyframe[] = [
            {
              transform: `translate${isAxis}(${offset}px) scale(${scale})`,
              opacity: animateOpacity ? initialOpacity : 1,
              offset: 0
            },
            {
              transform: `translate${isAxis}(0px) scale(1)`,
              opacity: 1,
              offset: 1
            }
          ];

          const animationOptions: KeyframeAnimationOptions = {
            duration: duration * 1000,
            easing: ease,
            delay: delay * 1000,
            fill: 'forwards',
            composite: 'replace'
          };

          const animation = el.animate(keyframes, animationOptions);

          animation.onfinish = () => {
            if (onComplete) {
              onComplete();
            }
            observer.unobserve(el);
          };
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (el.getAnimations) {
        el.getAnimations().forEach(animation => animation.cancel());
      }
    };
  }, [
    isVisible,
    useScrollTrigger,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    onComplete
  ]);

  // For state-driven animation, always set initial state in JSX so it never gets removed
  const isAxis = direction === 'horizontal' ? 'X' : 'Y';
  const offset = reverse ? -distance : distance;
  const shouldShowInitialState = !useScrollTrigger && (isVisible === false || isVisible === true);

  return (
    <div
      ref={ref}
      style={
        shouldShowInitialState
          ? {
              opacity: animateOpacity ? initialOpacity : 1,
              transform: `translate${isAxis}(${offset}px)`,
              willChange: 'transform, opacity',
            }
          : {
              opacity: isVisible === false && !useScrollTrigger ? (animateOpacity ? initialOpacity : 1) : undefined,
              transform: isVisible === false && !useScrollTrigger
                ? `${direction === 'horizontal' ? 'translateX' : 'translateY'}(${reverse ? -distance : distance}px)`
                : undefined,
              willChange: !useScrollTrigger ? 'transform, opacity' : undefined,
            }
      }
    >
      {children}
    </div>
  );
};

export default AnimatedContent;