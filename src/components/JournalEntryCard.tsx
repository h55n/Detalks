
import React from 'react';
import { Clock, Mic, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  mood?: string;
  imageUrl?: string;
  audioUrl?: string;
  color?: string;
}

interface JournalEntryCardProps {
  entry: JournalEntry;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry }) => {
  const handleDelete = () => {
    // Get current entries
    const storageKey = 'journal_entries';
    const savedEntries = localStorage.getItem(storageKey);
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      const filteredEntries = entries.filter((e: JournalEntry) => e.id !== entry.id);
      localStorage.setItem(storageKey, JSON.stringify(filteredEntries));
      
      // This would re-render in a real app with proper state management
      toast("Entry Deleted", {
        description: "Journal entry has been removed",
        duration: 1500,
      });
      
      // In a real app, you would use a better state management approach
      // This forces a refresh to show the updated list
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className={`rounded-xl p-4 ${entry.color || 'bg-gray-100 dark:bg-gray-800'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-50">{entry.title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
            <Clock size={12} className="mr-1" />
            {entry.time}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
                <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => toast("Edit Entry", {
                  description: "Editing functionality would go here",
                  duration: 1500,
                })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => toast("Share Entry", {
                  description: "Sharing functionality would go here",
                  duration: 1500,
                })}
              >
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500" 
                onClick={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-3">
        {entry.content}
      </p>
      
      {entry.imageUrl && (
        <div className="mt-2 rounded-lg overflow-hidden">
          <img 
            src={entry.imageUrl} 
            alt="Journal attachment" 
            className="w-full h-auto max-h-48 object-cover"
          />
        </div>
      )}
      
      {entry.audioUrl && (
        <div className="mt-2 bg-gray-200/50 dark:bg-gray-700/50 p-2 rounded-lg flex items-center">
          <Mic size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-300">Voice Note</span>
          <div className="ml-auto">
            <button 
              className="bg-gray-300 dark:bg-gray-600 p-1 rounded-full"
              onClick={() => toast("Play Audio", {
                description: "Audio playback would go here",
                duration: 1500,
              })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntryCard;
