
import React from 'react';
import MoodSelector from '@/components/MoodSelector';
import MoodSlider from '@/components/MoodSlider';

interface MoodInputSectionProps {
  showTraditionalMood: boolean;
  todayMood: { value: number; comment: string } | null;
  onMoodSave: (value: number, label: string, comment: string) => void;
}

const MoodInputSection: React.FC<MoodInputSectionProps> = ({ 
  showTraditionalMood, 
  todayMood, 
  onMoodSave 
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">How are you feeling right now?</h3>
      {showTraditionalMood ? (
        <MoodSelector />
      ) : (
        <div className="mb-5">
          <MoodSlider 
            onSave={onMoodSave} 
            initialValue={todayMood?.value || 75}
            initialComment={todayMood?.comment || ''}
          />
        </div>
      )}
    </div>
  );
};

export default MoodInputSection;
