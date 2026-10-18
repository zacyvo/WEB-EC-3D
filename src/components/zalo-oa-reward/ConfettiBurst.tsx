'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { confettiLifetimeMs, makeConfetti } from '@/lib/zalo-oa-reward';

/**
 * One confetti burst. Each new `burstKey` replays it; the pieces are removed from the DOM
 * (and the timer cleared) when the burst ends or the component unmounts. Renders nothing
 * when `disabled` (prefers-reduced-motion).
 */
export default function ConfettiBurst({ burstKey, count = 70, disabled = false }: { burstKey: number; count?: number; disabled?: boolean }) {
  const pieces = useMemo(() => makeConfetti(count, burstKey * 7919 + 13), [count, burstKey]);
  const [alive, setAlive] = useState(false);

  useEffect(() => {
    if (disabled || burstKey <= 0) return;
    setAlive(true);
    const t = window.setTimeout(() => setAlive(false), confettiLifetimeMs(pieces));
    return () => window.clearTimeout(t);
  }, [pieces, disabled, burstKey]);

  if (disabled || !alive) return null;
  return (
    <div
      aria-hidden
      data-testid="zalo-reward-confetti"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1600 }}
    >
      {pieces.map((p) => (
        <motion.span
          key={`${burstKey}-${p.id}`}
          initial={{ x: '50vw', y: '38vh', opacity: 1, rotate: 0, scale: 0.5 }}
          animate={{ x: `${50 + p.x}vw`, y: `${38 + p.y}vh`, opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.12, 0.65, 0.35, 1] }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            borderRadius: p.round ? '50%' : 2,
            background: p.color,
            boxShadow: p.color === '#FFFFFF' ? '0 0 0 1px rgba(201,162,74,0.45)' : undefined,
          }}
        />
      ))}
    </div>
  );
}
