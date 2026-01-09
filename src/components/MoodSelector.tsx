
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { SunMedium, CloudSun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

export type MoodType = 'rad' | 'good' | 'meh' | 'bad' | 'awful';

interface MoodSelectorProps {
  onMoodSelect?: (mood: MoodType) => void;
  initialMood?: MoodType | null;
  onNoteChange?: (note: string) => void;
  initialNote?: string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  onMoodSelect,
  initialMood = null,
  onNoteChange,
  initialNote = '',
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(initialMood);
  const [note, setNote] = useState(initialNote);

  const moods: { type: MoodType; icon: React.ElementType; label: string; color: string }[] = [
    { type: 'rad', icon: SunMedium, label: 'excellent', color: 'bg-brand-green' },
    { type: 'good', icon: CloudSun, label: 'good', color: 'bg-brand-yellow' },
    { type: 'meh', icon: Cloud, label: 'neutral', color: 'bg-brand-plum' },
    { type: 'bad', icon: CloudRain, label: 'troubled', color: 'bg-brand-pink' },
    { type: 'awful', icon: CloudLightning, label: 'distressed', color: 'bg-brand-orange' }
  ];

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    if (onNoteChange) {
      onNoteChange(e.target.value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900/95 p-5 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm">
      <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">How's it going?</h2>
      
      <div className="flex justify-between mb-6 animate-fade-in">
        {moods.map(mood => {
          const Icon = mood.icon;
          return (
            <div key={mood.type} className="flex flex-col items-center gap-2">
              <button
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  mood.color,
                  selectedMood === mood.type && "ring-2 ring-white ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900",
                  "transition-all duration-200 hover:scale-110 active:scale-95"
                )}
                onClick={() => handleMoodSelect(mood.type)}
              >
                <Icon className="text-white w-6 h-6" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">{mood.label}</span>
            </div>
          );
        })}
      </div>
      
      <Textarea
        placeholder="Write about your feelings..."
        className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 mt-4 rounded-xl px-4 min-h-[100px] resize-none focus:ring-2 focus:ring-brand-plum focus:border-transparent"
        value={note}
        onChange={handleNoteChange}
      />
    </div>
  );
};

export default MoodSelector;
