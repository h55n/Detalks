
import React, { useState } from 'react';
import { ArrowLeft, Trophy, Medal, Star, Filter, Calendar, Crown, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardEntry {
  id: number;
  name: string;
  streak: number;
  habitCount: number;
  trees: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'streak' | 'trees' | 'habits'>('streak');
  
  // Sample leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    { id: 1, name: 'Emma Johnson', streak: 32, habitCount: 18, trees: 9, avatar: 'EJ' },
    { id: 2, name: 'Michael Chen', streak: 28, habitCount: 21, trees: 8, avatar: 'MC' },
    { id: 3, name: 'Sarah', streak: 26, habitCount: 19, trees: 7, isCurrentUser: true, avatar: 'S' },
    { id: 4, name: 'David Kim', streak: 24, habitCount: 15, trees: 6, avatar: 'DK' },
    { id: 5, name: 'Jessica Patel', streak: 22, habitCount: 17, trees: 7, avatar: 'JP' },
    { id: 6, name: 'Marcus Wilson', streak: 20, habitCount: 14, trees: 5, avatar: 'MW' },
    { id: 7, name: 'Olivia Garcia', streak: 18, habitCount: 16, trees: 5, avatar: 'OG' },
    { id: 8, name: 'James Taylor', streak: 16, habitCount: 12, trees: 4, avatar: 'JT' },
    { id: 9, name: 'Sophia Rodriguez', streak: 14, habitCount: 13, trees: 4, avatar: 'SR' },
    { id: 10, name: 'Ethan Brown', streak: 12, habitCount: 10, trees: 3, avatar: 'EB' },
  ];
  
  // Filter and sort data based on selected filter
  const getSortedData = () => {
    return [...leaderboardData].sort((a, b) => {
      if (filter === 'streak') return b.streak - a.streak;
      if (filter === 'trees') return b.trees - a.trees;
      return b.habitCount - a.habitCount;
    });
  };
  
  const sortedData = getSortedData();
  
  // Get correct label based on filter
  const getFilterLabel = () => {
    if (filter === 'streak') return 'Streak';
    if (filter === 'trees') return 'Trees';
    return 'Habits';
  };

  // Render medal icon based on position
  const renderPositionIcon = (position: number) => {
    switch(position) {
      case 1:
        return <Crown size={24} className="text-brand-yellow animate-float" />;
      case 2:
        return <Medal size={20} className="text-gray-400 animate-float" />;
      case 3:
        return <Medal size={18} className="text-brand-gold animate-float" />;
      default:
        return null;
    }
  };

  // Render tree or habit icon based on filter
  const renderFilterIcon = () => {
    if (filter === 'streak') return <Calendar size={16} className="text-icon-purple dark:text-icon-purple-light" />;
    if (filter === 'trees') return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-green">
        <path d="M12 2L7 12H17L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    return <Star size={16} className="text-icon-purple dark:text-icon-purple-light" />;
  };

  return (
    <div className="page-container pb-20">
      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center">
          <button 
            className="mr-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={22} className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-semibold">Leaderboard</h1>
        </div>
        <div className="relative">
          <button 
            className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full flex items-center space-x-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => {}}
          >
            <Filter size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-6">
        <button
          className={`flex-1 py-2 px-4 rounded-xl transition-all ${
            filter === 'streak'
              ? 'bg-icon-purple text-white dark:bg-icon-purple-light dark:text-black'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
          onClick={() => setFilter('streak')}
        >
          Streaks
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-xl transition-all ${
            filter === 'trees'
              ? 'bg-icon-purple text-white dark:bg-icon-purple-light dark:text-black'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
          onClick={() => setFilter('trees')}
        >
          Trees
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-xl transition-all ${
            filter === 'habits'
              ? 'bg-icon-purple text-white dark:bg-icon-purple-light dark:text-black'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
          onClick={() => setFilter('habits')}
        >
          Habits
        </button>
      </div>
      
      {/* Top 3 Winners Podium */}
      <div className="flex justify-around items-end mb-8 mt-4">
        {sortedData.slice(0, 3).map((user, index) => {
          // Determine which position they are in
          const position = index + 1;
          
          // Style based on position
          const podiumHeight = position === 1 ? 'h-32' : position === 2 ? 'h-24' : 'h-16';
          const avatarSize = position === 1 ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-lg';
          
          return (
            <div key={user.id} className="flex flex-col items-center">
              <div className="relative mb-2">
                <Avatar className={`${avatarSize} border-2 border-white ${user.isCurrentUser ? 'ring-2 ring-brand-pink' : ''}`}>
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} 
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-icon-purple text-white">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2">
                  {renderPositionIcon(position)}
                </div>
              </div>
              <p className={`text-sm font-medium ${user.isCurrentUser ? 'text-icon-purple dark:text-icon-purple-light font-bold' : ''}`}>
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {filter === 'streak' ? `${user.streak} days` : 
                 filter === 'trees' ? `${user.trees} trees` : 
                 `${user.habitCount} habits`}
              </p>
              <div className={`${podiumHeight} w-20 bg-gradient-to-t from-mood-purple to-icon-purple dark:from-icon-purple-light dark:to-icon-purple rounded-t-lg mt-2 flex items-center justify-center text-white dark:text-black font-bold text-xl animate-breathe`}>
                {position}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Rest of Leaderboard */}
      <div className="space-y-3 animate-fade-in">
        {sortedData.slice(3).map((user, index) => (
          <div 
            key={user.id} 
            className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center hover:translate-y-[-2px] transition-all ${
              user.isCurrentUser ? 'border-2 border-icon-purple dark:border-icon-purple-light' : ''
            }`}
          >
            <div className="w-8 text-center font-medium text-gray-500 dark:text-gray-400">
              {index + 4}
            </div>
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} 
                alt={user.name} 
              />
              <AvatarFallback className="bg-icon-purple/20 dark:bg-icon-purple/40 text-gray-700 dark:text-gray-300">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className={`font-medium ${user.isCurrentUser ? 'text-icon-purple dark:text-icon-purple-light' : ''}`}>
                {user.name} {user.isCurrentUser && '(You)'}
              </p>
            </div>
            <div className="flex items-center gap-1 font-medium">
              {filter === 'streak' ? (
                <>
                  <Calendar size={16} className="text-icon-purple dark:text-icon-purple-light" />
                  <span>{user.streak} days</span>
                </>
              ) : filter === 'trees' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-green">
                    <path d="M12 2L7 12H17L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{user.trees}</span>
                </>
              ) : (
                <>
                  <Star size={16} className="text-icon-purple dark:text-icon-purple-light" />
                  <span>{user.habitCount}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
