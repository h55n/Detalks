
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breathing = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(4);
  const [isActive, setIsActive] = useState(true);
  
  // 4-7-8 breathing technique
  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8
  };
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      if (counter > 1) {
        setCounter(prev => prev - 1);
      } else {
        // Move to next phase and set counter based on duration
        let nextPhase: 'inhale' | 'hold' | 'exhale';
        if (phase === 'inhale') nextPhase = 'hold';
        else if (phase === 'hold') nextPhase = 'exhale';
        else nextPhase = 'inhale';
        
        setCounter(phaseDurations[nextPhase]);
        setPhase(nextPhase);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [counter, phase, isActive]);

  const getInstructions = () => {
    switch(phase) {
      case 'inhale': return 'Breathe in slowly through your nose';
      case 'hold': return 'Hold your breath';
      case 'exhale': return 'Exhale slowly through your mouth';
    }
  };
  
  // Calculate animation scale based on phase
  const getCircleScale = () => {
    if (phase === 'inhale') {
      // Start small and grow during inhale
      const progress = 1 - (counter / phaseDurations.inhale);
      return 0.9 + (progress * 0.3); // Scale from 0.9 to 1.2
    } else if (phase === 'hold') {
      return 1.2; // Stay fully expanded during hold
    } else {
      // Shrink during exhale
      const progress = 1 - (counter / phaseDurations.exhale);
      return 1.2 - (progress * 0.3); // Scale from 1.2 to 0.9
    }
  };
  
  const scaleValue = getCircleScale();
  
  return (
    <div className="page-container bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold">Breathing Exercise</h1>
      </div>
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium mb-2">4-7-8 Technique</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Breathe in for 4, hold for 7, exhale for 8
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center mt-12">
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{getInstructions()}</p>
          <p className="text-3xl font-light mt-1">{counter}</p>
        </div>
        
        <div 
          className={`relative w-64 h-64 rounded-full flex items-center justify-center backdrop-blur-sm text-white text-2xl transition-all duration-1000 ${
            phase === 'inhale' ? 'bg-blue-400/80 dark:bg-blue-500/40' : 
            phase === 'hold' ? 'bg-purple-400/80 dark:bg-purple-500/40' : 'bg-teal-400/80 dark:bg-teal-500/40'
          }`}
          style={{ 
            transform: `scale(${scaleValue})`,
            boxShadow: `0 0 ${scaleValue * 40}px ${
              phase === 'inhale' ? 'rgba(96, 165, 250, 0.4)' : 
              phase === 'hold' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(45, 212, 191, 0.4)'
            }`
          }}
        >
          <div className="absolute inset-0 rounded-full animate-pulse opacity-50" 
            style={{ 
              background: phase === 'inhale' ? 'radial-gradient(circle, rgba(96, 165, 250, 0.5) 0%, rgba(96, 165, 250, 0) 70%)' : 
                         phase === 'hold' ? 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(168, 85, 247, 0) 70%)' : 
                         'radial-gradient(circle, rgba(45, 212, 191, 0.5) 0%, rgba(45, 212, 191, 0) 70%)'
            }}
          ></div>
          <span className="uppercase text-base tracking-wider">{phase}</span>
        </div>
        
        <button 
          className="mt-16 bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          onClick={() => setIsActive(prev => !prev)}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
          {isActive ? 'Pause' : 'Resume'}
        </button>
        
        <div className="mt-12 text-center text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
          <h3 className="font-medium mb-2">Benefits of 4-7-8 Breathing</h3>
          <p className="text-sm">
            This technique helps reduce anxiety, manage stress responses, and improve sleep. 
            Practice regularly for best results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Breathing;
