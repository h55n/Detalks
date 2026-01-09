
import React, { useState } from 'react';
import { Calendar, ArrowRight, SunMedium, CloudSun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { format, getDaysInMonth, getDay, startOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { MoodType } from './MoodSelector';

export interface DayMood {
  date: Date;
  mood: MoodType | null;
}

interface MoodCalendarProps {
  moodData: DayMood[];
  onSelectDate: (date: Date) => void;
  selectedDate?: Date;
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({
  moodData,
  onSelectDate,
  selectedDate = new Date(),
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const getMoodColor = (mood: MoodType | null): string => {
    switch (mood) {
      case 'rad': return 'bg-brand-green';
      case 'good': return 'bg-brand-yellow';
      case 'meh': return 'bg-brand-plum';
      case 'bad': return 'bg-brand-pink';
      case 'awful': return 'bg-brand-orange';
      default: return 'bg-gray-300 dark:bg-gray-600';
    }
  };
  
  const getMoodIcon = (mood: MoodType | null): JSX.Element => {
    switch (mood) {
      case 'rad': return <SunMedium className="w-4 h-4 text-white" />;
      case 'good': return <CloudSun className="w-4 h-4 text-white" />;
      case 'meh': return <Cloud className="w-4 h-4 text-white" />;
      case 'bad': return <CloudRain className="w-4 h-4 text-white" />;
      case 'awful': return <CloudLightning className="w-4 h-4 text-white" />;
      default: return <div className="w-4 h-4 flex items-center justify-center text-xs text-white">+</div>;
    }
  };
  
  // Generate calendar grid
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const startDay = getDay(startOfMonth(currentMonth));
    const calendarDays = [];
    
    // Add previous month days
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(null);
    }
    
    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayMood = moodData.find(d => 
        d.date.getDate() === date.getDate() && 
        d.date.getMonth() === date.getMonth() && 
        d.date.getFullYear() === date.getFullYear()
      );
      
      calendarDays.push({
        date,
        mood: dayMood?.mood || null
      });
    }
    
    return (
      <div className="grid grid-cols-7 gap-1 mt-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={idx} className="text-center text-xs text-gray-400 font-medium py-1">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, idx) => 
          day === null ? (
            <div key={idx} className="h-8"></div>
          ) : (
            <div
              key={idx}
              className={cn(
                "h-8 w-8 rounded-full text-center flex items-center justify-center text-xs cursor-pointer mx-auto",
                getMoodColor(day.mood),
                day.mood === null && "border border-gray-200 dark:border-gray-700",
                selectedDate && 
                  day.date.getDate() === selectedDate.getDate() &&
                  day.date.getMonth() === selectedDate.getMonth() &&
                  day.date.getFullYear() === selectedDate.getFullYear() &&
                  "ring-2 ring-brand-plum ring-offset-2 dark:ring-offset-gray-900"
              )}
              onClick={() => onSelectDate(day.date)}
            >
              {day.mood ? getMoodIcon(day.mood) : '+'}
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900/90 rounded-xl p-4 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-plum" />
          <h3 className="text-gray-800 dark:text-gray-200 font-medium">Calendar</h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-2">Tap on the day to see more</p>
      
      {renderCalendar()}
      
      <div className="flex justify-center mt-4">
        <button className="flex items-center text-sm text-white bg-brand-plum px-3 py-1 rounded-full hover:bg-brand-plum/90 transition-colors">
          <span>See full</span>
          <ArrowRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MoodCalendar;
