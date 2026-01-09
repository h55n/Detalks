
import React from 'react';

interface TabSelectorProps {
  activeTab: 'self-guided' | 'professional';
  onTabChange: (tab: 'self-guided' | 'professional') => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex mb-6 space-x-4">
      <button
        className={`flex-1 py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
          activeTab === 'self-guided'
            ? 'bg-black text-white dark:bg-gray-800'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300'
        }`}
        onClick={() => onTabChange('self-guided')}
      >
        Self-Guided
      </button>
      <button
        className={`flex-1 py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
          activeTab === 'professional'
            ? 'bg-black text-white dark:bg-gray-800'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300'
        }`}
        onClick={() => onTabChange('professional')}
      >
        Professional
      </button>
    </div>
  );
};

export default TabSelector;
