
import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
  currentGenre: string;
  isPlaying: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  className = "", 
  currentGenre,
  isPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  
  // Generate colors based on genre
  const getRandomColor = (genre: string): string => {
    switch(genre) {
      case 'nature':
        return ['rgba(200, 222, 122, 0.8)', 'rgba(200, 222, 122, 0.5)', 'rgba(190, 177, 203, 0.6)'][Math.floor(Math.random() * 3)];
      case 'meditation':
        return ['rgba(190, 177, 203, 0.8)', 'rgba(190, 177, 203, 0.5)', 'rgba(249, 184, 211, 0.4)'][Math.floor(Math.random() * 3)];
      case 'ambient':
        return ['rgba(253, 190, 42, 0.6)', 'rgba(253, 190, 42, 0.4)', 'rgba(241, 76, 39, 0.3)'][Math.floor(Math.random() * 3)];
      case 'lofi':
        return ['rgba(249, 184, 211, 0.7)', 'rgba(249, 184, 211, 0.4)', 'rgba(241, 76, 39, 0.4)'][Math.floor(Math.random() * 3)];
      default:
        return ['rgba(190, 177, 203, 0.6)', 'rgba(200, 222, 122, 0.5)', 'rgba(249, 184, 211, 0.4)'][Math.floor(Math.random() * 3)];
    }
  };
  
  // Function to create particles
  const createParticles = (canvas: HTMLCanvasElement, count: number): Particle[] => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: getRandomColor(currentGenre),
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    return particles;
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Regenerate particles on resize
        particlesRef.current = createParticles(canvas, 40);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Initialize particles
    particlesRef.current = createParticles(canvas, 40);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particlesRef.current.forEach(particle => {
        // Update position
        if (isPlaying) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
        } else {
          // Slower movement when paused
          particle.x += particle.speedX * 0.2;
          particle.y += particle.speedY * 0.2;
        }
        
        // Bounce off walls
        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY = -particle.speedY;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      
      // Draw subtle connection lines between particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [currentGenre, isPlaying]);

  // When genre changes, update particle colors
  useEffect(() => {
    particlesRef.current = particlesRef.current.map(particle => ({
      ...particle,
      color: getRandomColor(currentGenre)
    }));
  }, [currentGenre]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br opacity-50"></div>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
