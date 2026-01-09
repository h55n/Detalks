
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  label: string;
  percentage: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  label, 
  percentage,
  className
}) => {
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm font-medium text-white">{percentage}%</span>
      </div>
      <div className="w-full bg-white/30 rounded-full h-2.5">
        <div 
          className="bg-white/80 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
