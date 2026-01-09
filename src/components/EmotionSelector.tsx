
import React from 'react';
import { Plus } from 'lucide-react';

interface EmotionSelectorProps {
  selectedEmotions: string[];
  onChange: (emotions: string[]) => void;
}

const emotions = [
  'annoyed', 'anxious', 'fearful',
  'depressed', 'sad', 'lonely',
  'guilty', 'shame', 'angry',
  'tired', 'bored', 'calm',
  'unmotivated', 'relaxed', 'productive', 
  'content', 'grateful', 'confident', 
  'proud', 'love', 'happy'
];

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ 
  selectedEmotions, 
  onChange 
}) => {
  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      onChange(selectedEmotions.filter(e => e !== emotion));
    } else {
      onChange([...selectedEmotions, emotion]);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {emotions.map(emotion => (
        <button
          key={emotion}
          onClick={() => toggleEmotion(emotion)}
          className={`py-2 px-4 rounded-md transition-colors text-center text-sm ${
            selectedEmotions.includes(emotion)
              ? 'bg-brand-plum text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {emotion}
        </button>
      ))}
      <button
        className="py-2 px-4 rounded-md bg-brand-green/20 dark:bg-brand-green/10 text-brand-green border border-brand-green/30 flex items-center justify-center hover:bg-brand-green/30 transition-colors"
        onClick={() => {
          // This would open a modal to add custom emotion in a real app
          // For now, we'll just show a toast
          alert('Custom emotion functionality would go here');
        }}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default EmotionSelector;
