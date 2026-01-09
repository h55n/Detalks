
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavbar } from '@/context/NavbarContext';

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { isNavbarVisible } = useNavbar();

  // Hide navbar for feature pages
  if (!isNavbarVisible) {
    return null;
  }

  const tabs = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Stats',
      path: '/stats',
      icon: BarChart
    },
    {
      name: 'Leaderboard',
      path: '/leaderboard',
      icon: Trophy
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-4 z-10 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 transition-colors duration-300">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || 
                           (tab.path !== '/' && pathname.startsWith(tab.path));
          const Icon = tab.icon;
          
          return (
            <Link 
              key={tab.path} 
              to={tab.path} 
              className={cn(
                "tab-button flex flex-col items-center p-2 rounded-lg transition-all", 
                isActive 
                  ? "active bg-gray-50 dark:bg-gray-800" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "mb-1 transition-all", 
                  isActive 
                    ? "text-icon-purple dark:text-icon-purple-light" 
                    : "text-gray-500 dark:text-gray-400"
                )} 
              />
              <span 
                className={cn(
                  "text-xs transition-all", 
                  isActive 
                    ? "text-icon-purple dark:text-icon-purple-light" 
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
