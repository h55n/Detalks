
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getTodaysMoodEntry, getAllMoodEntries } from '@/utils/moodStorage';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  if (!isOpen) return null;
  
  const moodEntries = getAllMoodEntries();
  
  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Function to determine the color based on mood value
  const getMoodColor = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const entry = moodEntries.find(entry => {
      try {
        const entryDate = parseISO(entry.date);
        return format(entryDate, 'yyyy-MM-dd') === dateString;
      } catch (e) {
        return false;
      }
    });
    
    if (!entry) return 'bg-gray-100 dark:bg-gray-800/30';
    
    const value = entry.value;
    if (value >= 80) return 'bg-green-400 dark:bg-green-500';
    if (value >= 60) return 'bg-emerald-300 dark:bg-emerald-400';
    if (value >= 40) return 'bg-yellow-300 dark:bg-yellow-400';
    if (value >= 20) return 'bg-red-300 dark:bg-red-400';
    return 'bg-red-400 dark:bg-red-500';
  };
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Days of the week header
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-[90%] max-w-md shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Calendar</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <button onClick={previousMonth} className="p-2 text-gray-600 dark:text-gray-400">
              &lt;
            </button>
            <h3 className="text-lg font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
            <button onClick={nextMonth} className="p-2 text-gray-600 dark:text-gray-400">
              &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: getDay(monthStart) }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-10"></div>
            ))}
            
            {daysInMonth.map((day, index) => (
              <div 
                key={index}
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center text-sm mx-auto",
                  getMoodColor(day),
                  isToday(day) && "ring-2 ring-amber-400 dark:ring-amber-500"
                )}
              >
                {format(day, 'd')}
              </div>
            ))}
            
            {Array.from({ length: 6 - getDay(monthEnd) }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-10"></div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-xs">Great</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                <span className="text-xs">Okay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-xs">Poor</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <Button 
            onClick={onClose}
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

function getDay(date: Date): number {
  let day = date.getDay();
  return day;
}

export default CalendarModal;
