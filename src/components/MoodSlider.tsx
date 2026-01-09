
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, SunMedium, CloudSun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { MoodType } from './MoodSelector';

interface MoodSliderProps {
  onSave?: (mood: number, label: string, comment: string) => void;
  initialValue?: number;
  initialComment?: string;
}

// Mood labels mapped to slider values
const moodLabels = [
  { value: 0, label: "Distressed", color: "bg-brand-orange/20 dark:bg-brand-orange/10", icon: CloudLightning },
  { value: 25, label: "Troubled", color: "bg-brand-pink/20 dark:bg-brand-pink/10", icon: CloudRain },
  { value: 50, label: "Neutral", color: "bg-brand-plum/20 dark:bg-brand-plum/10", icon: Cloud },
  { value: 75, label: "Good", color: "bg-brand-green/20 dark:bg-brand-green/10", icon: CloudSun },
  { value: 100, label: "Excellent", color: "bg-brand-yellow/20 dark:bg-brand-yellow/10", icon: SunMedium }
];

const MoodSlider: React.FC<MoodSliderProps> = ({ 
  onSave, 
  initialValue = 75, 
  initialComment = '' 
}) => {
  const [sliderValue, setSliderValue] = useState(initialValue);
  const [comment, setComment] = useState(initialComment);
  const [showCommentInput, setShowCommentInput] = useState(false);
  
  // Find the closest mood label based on slider value
  const getCurrentMood = () => {
    return moodLabels.reduce((prev, curr) => {
      return Math.abs(curr.value - sliderValue) < Math.abs(prev.value - sliderValue) ? curr : prev;
    });
  };
  
  const currentMood = getCurrentMood();
  const Icon = currentMood.icon;
  
  const handleSave = () => {
    if (onSave) {
      onSave(sliderValue, currentMood.label, comment);
    }
  };

  return (
    <div className={`p-4 rounded-2xl ${currentMood.color} transition-colors duration-300 shadow-sm border border-black/5`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-center text-lg font-medium">{currentMood.label}</h2>
        <div className="text-2xl">
          <Icon size={28} className={`
            ${sliderValue <= 25 ? "text-brand-orange" : 
             sliderValue <= 50 ? "text-brand-plum" : 
             sliderValue <= 75 ? "text-brand-green" : "text-brand-yellow"}
          `} />
        </div>
      </div>
      
      {/* Mood icon */}
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 bg-white/80 dark:bg-gray-800/50 rounded-full flex items-center justify-center shadow-sm">
          <Icon 
            size={32} 
            className={`
              ${sliderValue <= 25 ? "text-brand-orange" : 
               sliderValue <= 50 ? "text-brand-plum" : 
               sliderValue <= 75 ? "text-brand-green" : "text-brand-yellow"}
            `}
          />
        </div>
      </div>
      
      {/* Slider */}
      <div className="mb-3 px-2">
        <Slider
          value={[sliderValue]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setSliderValue(value[0])}
          className="mb-2"
        />
      </div>
      
      {/* Comment section */}
      {showCommentInput ? (
        <div className="mb-3">
          <Input
            type="text"
            placeholder="How are you feeling?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white/70 dark:bg-gray-800/30 border-0 text-sm"
          />
        </div>
      ) : (
        <button 
          onClick={() => setShowCommentInput(true)}
          className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 mb-3 opacity-70 hover:opacity-100 transition-opacity"
        >
          <MessageCircle size={14} />
          <span>Add a note</span>
        </button>
      )}
      
      {/* Done button */}
      <Button
        className="w-full bg-brand-plum text-white hover:bg-brand-plum/90 text-sm py-1 h-8"
        onClick={handleSave}
      >
        Save
      </Button>
    </div>
  );
};

export default MoodSlider;
