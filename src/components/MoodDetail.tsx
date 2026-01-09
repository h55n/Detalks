
import React from 'react';
import { Clock, Edit2, X, SunMedium, CloudSun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { format } from 'date-fns';
import { MoodType } from './MoodSelector';

interface MoodDetailProps {
  mood: MoodType;
  date: Date;
  note: string;
  onEdit: () => void;
  onClose: () => void;
}

const MoodDetail: React.FC<MoodDetailProps> = ({
  mood,
  date,
  note,
  onEdit,
  onClose
}) => {
  const getMoodIcon = (mood: MoodType): JSX.Element => {
    switch (mood) {
      case 'rad': return <SunMedium className="w-7 h-7 text-white" />;
      case 'good': return <CloudSun className="w-7 h-7 text-white" />;
      case 'meh': return <Cloud className="w-7 h-7 text-white" />;
      case 'bad': return <CloudRain className="w-7 h-7 text-white" />;
      case 'awful': return <CloudLightning className="w-7 h-7 text-white" />;
      default: return <Cloud className="w-7 h-7 text-white" />;
    }
  };
  
  const getMoodLabel = (mood: MoodType): string => {
    switch (mood) {
      case 'rad': return 'Excellent';
      case 'good': return 'Good';
      case 'meh': return 'Neutral';
      case 'bad': return 'Troubled';
      case 'awful': return 'Distressed';
      default: return 'Neutral';
    }
  };
  
  const getMoodColor = (mood: MoodType): string => {
    switch (mood) {
      case 'rad': return 'bg-brand-green';
      case 'good': return 'bg-brand-yellow';
      case 'meh': return 'bg-brand-plum';
      case 'bad': return 'bg-brand-pink';
      case 'awful': return 'bg-brand-orange';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-5 border border-gray-200 dark:border-gray-800 shadow-xl animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mood Detail</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`${getMoodColor(mood)} w-14 h-14 rounded-full flex items-center justify-center`}>
            {getMoodIcon(mood)}
          </div>
          
          <div>
            <div className="text-xl font-medium text-gray-900 dark:text-white">{getMoodLabel(mood)}</div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Clock size={14} className="mr-1" />
              {format(date, 'EEEE, MMMM d, yyyy • h:mm a')}
            </div>
          </div>
        </div>
        
        {note && (
          <div className="bg-gray-100 dark:bg-gray-800/60 rounded-lg p-3 my-4 text-gray-700 dark:text-gray-300">
            {note}
          </div>
        )}
        
        <button 
          onClick={onEdit}
          className="flex items-center justify-center gap-2 w-full bg-brand-plum hover:bg-brand-plum/90 text-white py-2 rounded-lg mt-4 transition-colors"
        >
          <Edit2 size={16} />
          <span>Edit Entry</span>
        </button>
      </div>
    </div>
  );
};

export default MoodDetail;
