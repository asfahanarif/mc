
'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  value: string;
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const targetValue = parseInt(value.replace('+', ''), 10);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (inView && !isNaN(targetValue)) {
      let startTimestamp: number | null = null;
      const duration = 1500; // ms

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentNum = Math.floor(progress * targetValue);
        setDisplayValue(currentNum);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [inView, targetValue]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{value.includes('+') ? '+' : ''}
    </span>
  );
}
