
import React from 'react';

interface TreeIconProps {
  className?: string;
  size?: number;
}

const TreeIcon: React.FC<TreeIconProps> = ({ className = "", size = 16 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M12 2L7 12H17L12 22" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TreeIcon;
