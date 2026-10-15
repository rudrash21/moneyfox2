import React, { useEffect, useRef, useState } from 'react';

type WaveMode = 'curve' | 'flat' | 'ramp';

interface GoldenWaveVisualizerProps {
  className?: string;
  showControls?: boolean;
}

export const GoldenWaveVisualizer: React.FC<GoldenWaveVisualizerProps> = ({
  className = '',
  showControls = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<WaveMode>('curve');
  const animationFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const parent = containerRef.current || canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      const elapsed = (time - startTimeRef.current) / 1000;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Distinct vertical columns spanning the entire width
      const targetBarWidth = width < 640 ? 12 : width < 1024 ? 16 : 20;
      const gap = 1.5;
      const numBars = Math.max(10, Math.floor(width / targetBarWidth));
      const actualBarWidth = width / numBars;

      // Pure fixed center at 0.5 (no cursor influence)
      const fixedCenter = 0.5;

      // The center moves up and down like waves (harmonic oscillation)
      // centerPeak: normalized vertical crest position in [0.18, 0.42] (higher up on screen)
      const centerPeak = 0.26 + 0.12 * Math.sin(elapsed * 1.5) + 0.04 * Math.sin(elapsed * 2.7);

      // Phase for wave ripple propagation
      const wavePhase = elapsed * 2.4;

      for (let i = 0; i < numBars; i++) {
        const u = i / (numBars - 1); // 0.0 (left) to 1.0 (right)
        const x = i * actualBarWidth;

        // Calculate normalized crest position 'c' along this column (0.0 = top, 1.0 = bottom)
        let c = 0.5;

        if (activeMode === 'curve') {
          // Bell curve where the center moves up and down like waves, tapering to sides
          const dist = Math.abs(u - fixedCenter);
          const bell = Math.exp(-Math.pow(dist / 0.30, 2));

          // Traveling harmonic ripple waves
          const ripple = 0.08 * Math.sin(dist * 14 - wavePhase);
          const ambientWave = 0.04 * Math.cos(u * 8 + elapsed * 1.2);

          const baseSide = 0.78;
          c = baseSide - (bell * (baseSide - centerPeak)) + (ripple * bell) + ambientWave * (1 - bell * 0.5);
        } else if (activeMode === 'flat') {
          // Continuous undulating wave spanning the whole width
          const wave1 = 0.12 * Math.sin(u * 9 - wavePhase);
          const wave2 = 0.07 * Math.cos(u * 16 + elapsed * 1.8);
          const centerSwell = 0.10 * Math.sin(elapsed * 1.8) * Math.exp(-Math.pow((u - 0.5) / 0.4, 2));
          c = 0.46 + wave1 + wave2 + centerSwell;
        } else if (activeMode === 'ramp') {
          // Ascending ramp wave with rolling crest
          const rampBase = 0.70 - 0.46 * u;
          const undulatingWave = 0.10 * Math.sin(u * 10 - wavePhase);
          const centerPulse = 0.08 * Math.sin(elapsed * 2.0) * Math.sin(u * Math.PI);
          c = rampBase + undulatingWave + centerPulse;
        }

        // Clamp c safely within visible range
        c = Math.max(0.08, Math.min(0.92, c));

        // Create linear gradient along the entire height of this column (covers whole section)
        const gradient = ctx.createLinearGradient(x, 0, x, height);

        const stops: { offset: number; color: string }[] = [
          { offset: 0.0, color: 'rgba(10, 10, 14, 0.98)' },
          { offset: Math.max(0, c - 0.28), color: 'rgba(14, 12, 18, 0.95)' },
          { offset: Math.max(0, c - 0.14), color: 'rgba(120, 53, 15, 0.55)' },
          { offset: Math.max(0, c - 0.04), color: 'rgba(217, 119, 6, 0.85)' },
          { offset: c, color: 'rgba(254, 243, 199, 0.98)' }, // bright champagne-gold crest
          { offset: Math.min(1, c + 0.05), color: 'rgba(245, 158, 11, 0.96)' }, // vibrant amberfox gold
          { offset: Math.min(1, c + 0.15), color: 'rgba(234, 88, 12, 0.88)' },  // warm fox orange
          { offset: Math.min(1, c + 0.28), color: 'rgba(180, 83, 9, 0.70)' },  // copper
          { offset: Math.min(1, c + 0.44), color: 'rgba(120, 53, 15, 0.45)' }, // deep bronze
          { offset: 1.0, color: 'rgba(10, 10, 14, 0.90)' },
        ];

        // Ensure offsets are strictly non-decreasing for canvas gradient
        stops.sort((a, b) => a.offset - b.offset);
        let lastOffset = 0;
        for (const s of stops) {
          const safeOffset = Math.max(lastOffset, Math.min(1, s.offset));
          gradient.addColorStop(safeOffset, s.color);
          lastOffset = safeOffset;
        }

        ctx.fillStyle = gradient;

        // Draw the vertical column covering the entire height of the section
        const barDrawWidth = Math.max(1, actualBarWidth - gap);
        ctx.fillRect(x, 0, barDrawWidth, height);

        // Vertical hairline separator edge spanning the entire column height
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.09)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x + barDrawWidth, 0);
        ctx.lineTo(x + barDrawWidth, height);
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [activeMode]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
    >
      {/* Background Canvas spanning full section */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          filter: 'drop-shadow(0 0 35px rgba(245, 158, 11, 0.25))',
        }}
      />

      {/* Pill Buttons as shown in user reference image: Curve / Flat / Ramp */}
      {showControls && (
        <div className="absolute bottom-6 left-6 sm:left-10 z-20 flex items-center gap-2 pointer-events-auto">
          {(['curve', 'flat', 'ramp'] as WaveMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setActiveMode(mode)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-200 cursor-pointer backdrop-blur-md ${
                activeMode === mode
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow border border-amberfox'
                  : 'bg-noir-900/85 hover:bg-noir-850 text-parchment-200 hover:text-amberfox border border-amberfox/30 hover:border-amberfox/70'
              }`}
            >
              {mode === 'curve' ? 'Curve' : mode === 'flat' ? 'Flat' : 'Ramp'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
