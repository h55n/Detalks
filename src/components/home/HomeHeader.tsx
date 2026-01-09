
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HomeHeaderProps {
  todayMood: { value: number; comment: string } | null;
  onCalendarClick: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ todayMood, onCalendarClick }) => {
  return (
    <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/60 dark:to-amber-950 mb-6 -mx-4 px-4 py-5 rounded-b-[2rem] shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9 border-2 border-amber-200/50 dark:border-amber-700/50 shadow-sm">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white">
              S
            </AvatarFallback>
          </Avatar>
          <span className="text-amber-800 dark:text-amber-100 font-medium">{format(new Date(), 'EEEE, MMM dd')}</span>
        </div>
        <div className="relative">
          <button 
            className="p-2 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-sm hover:bg-white/30 transition-colors"
            onClick={onCalendarClick}
          >
            <Calendar className="text-amber-800 dark:text-amber-100" size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-5 mt-4">
        <div className="relative">
          <div className="bg-gradient-to-br from-amber-200/70 to-amber-300/70 dark:from-amber-800/40 dark:to-amber-700/40 w-16 h-16 rounded-full flex items-center justify-center text-amber-800 dark:text-amber-100 text-xl font-bold backdrop-blur-sm shadow-inner">
            {todayMood ? Math.round(todayMood.value) : 88}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-amber-800 rounded-full p-1 shadow-sm">
            <span className="text-amber-500 dark:text-amber-300 text-sm">
              {todayMood && todayMood.value >= 80 ? "✨" : 
               todayMood && todayMood.value >= 60 ? "🙂" : 
               todayMood && todayMood.value >= 40 ? "😐" : "😔"}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-amber-800 dark:text-amber-100 font-medium text-lg mb-1">
            Welcome back, Sarah
          </h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-amber-700/10 text-amber-700 dark:text-amber-300 border-amber-600/20 text-xs px-2 py-0.5">
              Anxious
            </Badge>
            <Badge variant="outline" className="bg-amber-700/10 text-amber-700 dark:text-amber-300 border-amber-600/20 text-xs px-2 py-0.5">
              Plus Member
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
