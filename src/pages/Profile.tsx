
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Bell, Lock, HelpCircle, LogOut, ChevronRight, Moon, Sun
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ProgressBar from '@/components/ProgressBar';
import { Switch } from '@/components/ui/switch';

const Profile = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Check for dark mode on initial load
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
    toast({
      title: darkMode ? "Light mode enabled" : "Dark mode enabled",
      duration: 1500,
    });
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: notificationsEnabled ? "Notifications disabled" : "Notifications enabled",
      duration: 1500,
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      duration: 1500,
    });
    // In a real app, we would handle the actual logout process
  };

  return (
    <div className="page-container">
      <div className="flex flex-col items-center mt-4 mb-6">
        <div className="w-16 h-16 bg-purple-200 dark:bg-purple-900 rounded-full mb-3 flex items-center justify-center">
          <div className="text-purple-800 dark:text-purple-200 font-bold text-xl">SW</div>
        </div>
        <h1 className="text-xl font-semibold">Sarah Wilson</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Member since 2024</p>
        
        <div className="flex gap-4 mt-3">
          <button 
            className="bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            onClick={() => toast({
              title: "Profile edit mode",
              description: "This feature would allow you to edit your profile",
              duration: 1500,
            })}
          >
            Edit Profile
          </button>
          <button 
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
      
      <div className="flex mb-6 justify-between text-center">
        <div className="flex-1 bg-mood-peach rounded-2xl p-3 dark:bg-gray-800 dark:text-gray-200">
          <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
          <p className="font-bold text-xl">7 days</p>
        </div>
        <div className="flex-1 bg-mood-peach rounded-2xl p-3 mx-2 dark:bg-gray-800 dark:text-gray-200">
          <p className="text-sm text-gray-600 dark:text-gray-400">Entries</p>
          <p className="font-bold text-xl">24</p>
        </div>
        <div className="flex-1 bg-mood-peach rounded-2xl p-3 dark:bg-gray-800 dark:text-gray-200">
          <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
          <p className="font-bold text-xl">8</p>
        </div>
      </div>
      
      <div className="bg-wellness-orange rounded-2xl p-4 mb-6 dark:bg-gray-800">
        <h2 className="text-white font-semibold text-lg mb-3">Wellness Goals</h2>
        
        <ProgressBar label="Daily Meditation" percentage={80} />
        <ProgressBar label="Mood Tracking" percentage={60} />
        <ProgressBar label="Journal Entries" percentage={40} />
      </div>
      
      <div className="space-y-4 dark:text-gray-200">
        <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
          <div className="flex items-center">
            <BookOpen size={20} className="mr-3 text-gray-700 dark:text-gray-300" />
            <span className="font-medium">Saved Entries</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">12</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Bell size={20} className="mr-3 text-gray-700 dark:text-gray-300" />
            <span className="font-medium">Notifications</span>
          </div>
          <div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={toggleNotifications}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Lock size={20} className="mr-3 text-gray-700 dark:text-gray-300" />
            <span className="font-medium">Privacy Settings</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
        
        <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
          <div className="flex items-center">
            <HelpCircle size={20} className="mr-3 text-gray-700 dark:text-gray-300" />
            <span className="font-medium">Help & Support</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
        
        <button 
          className="flex items-center p-3 text-red-500 w-full"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Log Out</span>
          <ChevronRight size={18} className="text-gray-400 ml-auto" />
        </button>
      </div>
    </div>
  );
};

export default Profile;
