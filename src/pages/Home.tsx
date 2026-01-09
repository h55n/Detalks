
import React, { useState, useEffect } from 'react';
import { saveMoodEntry, getTodaysMoodEntry } from '@/utils/moodStorage';
import { toast } from 'sonner';
import CalendarModal from '@/components/CalendarModal';

// Import new components
import HomeHeader from '@/components/home/HomeHeader';
import MoodInputSection from '@/components/home/MoodInputSection';
import TabSelector from '@/components/home/TabSelector';
import FeatureGrid from '@/components/home/FeatureGrid';

const Home = () => {
  const [activeTab, setActiveTab] = useState<'self-guided' | 'professional'>('self-guided');
  const [showTraditionalMood, setShowTraditionalMood] = useState(false);
  const [todayMood, setTodayMood] = useState<{value: number, comment: string} | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  useEffect(() => {
    // Check if we have today's mood entry
    const entry = getTodaysMoodEntry();
    if (entry) {
      setTodayMood({
        value: entry.value,
        comment: entry.comment
      });
    }
  }, []);
  
  const handleMoodSave = (value: number, label: string, comment: string) => {
    saveMoodEntry(value, label, comment);
    toast.success("Mood saved successfully!");
    setTodayMood({ value, comment });
  };
  
  return (
    <div className="page-container">
      {/* Header Component */}
      <HomeHeader 
        todayMood={todayMood} 
        onCalendarClick={() => setShowCalendar(true)}
      />
      
      {/* Mood Input Section */}
      <MoodInputSection 
        showTraditionalMood={showTraditionalMood}
        todayMood={todayMood}
        onMoodSave={handleMoodSave}
      />
      
      {/* Tab Selector */}
      <TabSelector 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
      
      {/* Feature Grids */}
      <FeatureGrid type={activeTab} />
      
      {/* Calendar Modal */}
      <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
    </div>
  );
};

export default Home;
