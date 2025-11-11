import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// ---- Type Definitions ----
interface Particle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  amplitudeX: number;
  amplitudeY: number;
  frequencyX: number;
  frequencyY: number;
  phase: number;
  type: 'lotus' | 'star' | 'swirl';
  baseRadius: number;
  rotationOffset: number;
  color: string;
}

interface AnimationParams {
  numParticles: number;
  symmetry: 'radial';
  numSectors: 12;
}

type ColorPalette = string[];

// Heritage-themed color palettes matching your project's theme
const goldenPalette: ColorPalette = ['#D4AF37', '#DAA520', '#B8860B', '#E6C547', '#F4C430', '#C9A236'];
const bronzePalette: ColorPalette = ['#CD7F32', '#B87333', '#A0522D', '#D2691E', '#C68E63', '#B8805A'];
const earthPalette: ColorPalette = ['#8B4513', '#A0522D', '#654321', '#7A5C2E', '#6F4E37', '#8B6914'];
const amberPalette: ColorPalette = ['#E2B76D', '#D4A574', '#C9A236', '#B8945E', '#A88650', '#C7A46A'];
const copperPalette: ColorPalette = ['#B87333', '#CD853F', '#D2691E', '#C68E63', '#B8805A', '#AA7744'];
const saffronPalette: ColorPalette = ['#FF9933', '#F4A460', '#E6994D', '#FF8C5A', '#F0A070', '#E89B5E'];

// Heritage blend palette - warm earthy tones with golden highlights
const heritagePalette: ColorPalette = [
  ...goldenPalette.slice(0, 3),
  ...bronzePalette.slice(0, 2),
  ...earthPalette.slice(0, 2),
  ...amberPalette.slice(0, 2),
  ...copperPalette.slice(0, 2),
  ...saffronPalette.slice(0, 1)
];

// ---- Main App Component ----
const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef<number>(0);

  const animationParams: AnimationParams = {
    numParticles: 200, // Reduced for better performance
    symmetry: 'radial',
    numSectors: 12,
  };
  
  const fadeFactor = 1 - 0.95; // Maximum trail length (0.95)
  const palette = heritagePalette; // Use heritage palette for traditional kolam colors

  // ---- Animation Logic ----

  // Effect for initialization and resizing.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext('2d')) return;

    const ctx = canvas.getContext('2d')!;

    const initParticles = () => {
      const newParticles: Particle[] = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const lotusCount = Math.floor(animationParams.numParticles * 0.2);
      const starCount = Math.floor(animationParams.numParticles * 0.4);
      
      for (let i = 0; i < animationParams.numParticles; i++) {
        const type = i < lotusCount ? 'lotus' : i < (lotusCount + starCount) ? 'star' : 'swirl';

        let p: Partial<Particle> = { 
            type, 
            color: palette[Math.floor(Math.random() * palette.length)],
            phase: Math.random() * Math.PI * 2,
            rotationOffset: Math.random() * 0.0005
        };

        if (type === 'lotus') {
            p.baseRadius = Math.random() * 20 + 60;
            p.amplitudeX = 30;
            p.amplitudeY = 30;
            p.frequencyX = 8;
            p.frequencyY = 8;
        } else if (type === 'star') {
            p.baseRadius = Math.random() * 50 + 150;
            p.amplitudeX = Math.random() * 40 + 20;
            p.amplitudeY = Math.random() * 40 + 20;
            p.frequencyX = 4;
            p.frequencyY = 4;
        } else { // swirl
            p.baseRadius = Math.random() * 80 + 250;
            p.amplitudeX = Math.random() * 50 + 50;
            p.amplitudeY = Math.random() * 50 + 50;
            p.frequencyX = Math.random() * 0.005 + 0.001;
            p.frequencyY = Math.random() * 0.005 + 0.001;
        }

        const initialAngle = Math.random() * Math.PI * 2;
        p.x = centerX + Math.cos(initialAngle) * p.baseRadius!;
        p.y = centerY + Math.sin(initialAngle) * p.baseRadius!;
        p.prevX = p.x;
        p.prevY = p.y;
        
        newParticles.push(p as Particle);
      }
      particlesRef.current = newParticles;
      timeRef.current = 0;
    };
    
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Performance optimization: Use willReadFrequently hint
      const newCtx = canvas.getContext('2d', { 
        alpha: true,
        desynchronized: true // Better performance for animations
      });
      
      initParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Effect for the animation loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext('2d')) return;
    const ctx = canvas.getContext('2d')!;

    let animationFrameId: number;
    
    const draw = () => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const particles = particlesRef.current;

        for (const p of particles) {
            // Optimized: Reduced blur for performance
            if (p.type === 'lotus') {
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 8;
            } else if (p.type === 'star') {
                ctx.lineWidth = 1.2;
                ctx.shadowBlur = 6;
            } else {
                ctx.lineWidth = 1;
                ctx.shadowBlur = 10;
            }
            
            ctx.strokeStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.globalAlpha = 0.85; // Slightly higher alpha for better visibility

            const drawPath = () => {
              ctx.beginPath();
              ctx.moveTo(p.prevX, p.prevY);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            };

            const angleIncrement = (Math.PI * 2) / animationParams.numSectors;
            for (let j = 0; j < animationParams.numSectors; j++) {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(j * angleIncrement);
                ctx.translate(-centerX, -centerY);
                drawPath();
                ctx.restore();
            }
        }
        
        ctx.globalAlpha = 1.0; // Reset alpha
    };

    const animate = () => {
      const particles = particlesRef.current;
      timeRef.current++;
      const time = timeRef.current;

      ctx.fillStyle = `rgba(28, 16, 10, ${fadeFactor})`; // Deep heritage brown background for contrast
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      particles.forEach(p => {
        p.prevX = p.x;
        p.prevY = p.y;
        
        const t = time * 0.01;
        
        if (p.type === 'lotus') {
            const angle = t * 0.5 + p.phase;
            const r = p.baseRadius + p.amplitudeX * Math.cos(p.frequencyX * angle);
            p.x = centerX + r * Math.cos(angle);
            p.y = centerY + r * Math.sin(angle);
        } else if (p.type === 'star') {
            const angle = t * 0.3 + p.phase;
            const r = p.baseRadius + p.amplitudeX * Math.sin(p.frequencyX * angle * 2);
            p.x = centerX + r * Math.cos(angle);
            p.y = centerY + r * Math.sin(angle);
        } else { // swirl
             const dynamicTime = time + p.phase;
             p.x = centerX + p.baseRadius * Math.cos(time * 0.0005 + p.rotationOffset) + p.amplitudeX * Math.sin(p.frequencyX * dynamicTime);
             p.y = centerY + p.baseRadius * Math.sin(time * 0.0005 + p.rotationOffset) + p.amplitudeY * Math.cos(p.frequencyY * dynamicTime);
        }
      });

      draw();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [fadeFactor]); // Reruns only when fadeFactor changes.

  return (
    <main className="relative w-screen h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full mix-blend-screen"
      />
      {/* Decorative heritage corner accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-amber-600/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-orange-600/10 to-transparent rounded-full blur-3xl"></div>
    </main>
  );
};

// ---- App Mounting Logic ----
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
