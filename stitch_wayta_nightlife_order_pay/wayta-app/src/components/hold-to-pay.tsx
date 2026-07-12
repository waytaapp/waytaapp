'use client';

import { useRef, useState, useEffect } from 'react';

interface HoldToPayProps {
  onComplete: () => void;
  disabled?: boolean;
  label?: string;
  amount?: string;
}

export function HoldToPay({
  onComplete,
  disabled = false,
  label = 'Press and hold to pay',
  amount,
}: HoldToPayProps) {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pressStartTime = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const HOLD_DURATION = 1000; // 1 second

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseDown = () => {
    if (disabled || isProcessing) return;

    pressStartTime.current = Date.now();
    setProgress(0);

    const animate = () => {
      if (!pressStartTime.current) return;

      const elapsed = Date.now() - pressStartTime.current;
      const newProgress = Math.min(elapsed / HOLD_DURATION, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Completed
        setIsProcessing(true);
        // Medium haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([30, 50, 30]);
        }
        // Simulate payment processing
        setTimeout(() => {
          onComplete();
          setProgress(0);
          setIsProcessing(false);
          pressStartTime.current = null;
        }, 400);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleMouseUp = () => {
    if (progress < 1 && progress > 0) {
      setProgress(0);
    }
    pressStartTime.current = null;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [progress]);

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      disabled={disabled || isProcessing}
      className="w-full h-14 rounded-full relative overflow-hidden font-medium transition-all active:scale-95 disabled:opacity-50"
    >
      {/* Background fill */}
      <div
        className="absolute inset-0 bg-primary transition-all"
        style={{ width: `${progress * 100}%` }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-black font-medium relative z-10">
        {isProcessing ? (
          <>
            <span className="text-sm">Processing...</span>
          </>
        ) : (
          <>
            <span className="text-xs opacity-75">Press and hold</span>
            <span className="text-sm font-mono">{amount || 'Confirm'}</span>
          </>
        )}
      </div>

      {/* Border */}
      <div className="absolute inset-0 border-2 border-primary rounded-full pointer-events-none" />

      {/* Glow effect */}
      {progress > 0 && progress < 1 && (
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{ boxShadow: 'var(--glow-amber) inset' }}
        />
      )}
    </button>
  );
}
