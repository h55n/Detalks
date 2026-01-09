
import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Trophy, TreeDeciduous, Flame, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, addDays, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Habit {
  id: number;
  name: string;
  streak: number;
  completedDates: string[]; // ISO strings of completed dates
}

interface HabitCompletion {
  date: string; // ISO string 
  habits: number[]; // array of habit IDs
}

const Habits = () => {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: 'Meditate', streak: 5, completedDates: [] },
    { id: 2, name: 'Exercise', streak: 3, completedDates: [] },
    { id: 3, name: 'Journal', streak: 7, completedDates: [] },
  ]);
  const [newHabit, setNewHabit] = useState('');
  const [treeCount, setTreeCount] = useState(15);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  
  // Initialize the completions for today if it doesn't exist
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (!completions.find(c => c.date === today)) {
      setCompletions([...completions, { date: today, habits: [] }]);
    }
  }, [completions]);
  
  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { 
        id: Date.now(), 
        name: newHabit, 
        streak: 0,
        completedDates: []
      }]);
      setNewHabit('');
      
      toast({
        title: "New habit added",
        description: `${newHabit} has been added to your habits`,
        duration: 1500,
      });
    }
  };
  
  const removeHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
    
    // Also remove this habit from completions
    setCompletions(completions.map(completion => ({
      ...completion,
      habits: completion.habits.filter(habitId => habitId !== id)
    })));
  };

  const toggleHabitCompletion = (habitId: number) => {
    const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    
    // Find or create completion for this date
    let dateCompletion = completions.find(c => c.date === dateString);
    
    if (!dateCompletion) {
      dateCompletion = { date: dateString, habits: [] };
      setCompletions([...completions, dateCompletion]);
    }
    
    // Toggle habit completion
    const updatedCompletions = completions.map(completion => {
      if (completion.date === dateString) {
        const habitIndex = completion.habits.indexOf(habitId);
        if (habitIndex >= 0) {
          // Remove habit from completed
          const newHabits = [...completion.habits];
          newHabits.splice(habitIndex, 1);
          return { ...completion, habits: newHabits };
        } else {
          // Add habit to completed
          return { ...completion, habits: [...completion.habits, habitId] };
        }
      }
      return completion;
    });
    
    setCompletions(updatedCompletions);
    
    // Update streaks
    updateStreaks(habitId, updatedCompletions);
  };
  
  const updateStreaks = (habitId: number, updatedCompletions: HabitCompletion[]) => {
    // Sort completions by date
    const sortedCompletions = [...updatedCompletions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        // Calculate streak
        let currentStreak = 0;
        const today = new Date();
        
        // Check if completed today
        const todayString = format(today, 'yyyy-MM-dd');
        const completedToday = sortedCompletions.find(c => c.date === todayString)?.habits.includes(habitId);
        
        if (completedToday) {
          currentStreak = 1;
          
          // Look back at previous days
          let checkDate = subDays(today, 1);
          let checkingDate = true;
          
          while (checkingDate) {
            const dateString = format(checkDate, 'yyyy-MM-dd');
            const dateCompletion = sortedCompletions.find(c => c.date === dateString);
            
            if (dateCompletion && dateCompletion.habits.includes(habitId)) {
              currentStreak++;
              checkDate = subDays(checkDate, 1);
            } else {
              checkingDate = false;
            }
          }
          
          // Check if we need to award a tree
          if (currentStreak % 7 === 0 && currentStreak > habit.streak) {
            setTreeCount(prev => prev + 1);
            toast({
              title: "New tree planted! 🌲",
              description: `You've maintained a ${currentStreak}-day streak for ${habit.name}!`,
              duration: 3000,
            });
          }
        }
        
        return { ...habit, streak: currentStreak };
      }
      return habit;
    }));
  };
  
  const isHabitCompletedOnDate = (habitId: number, date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const completion = completions.find(c => c.date === dateString);
    return completion ? completion.habits.includes(habitId) : false;
  };
  
  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-semibold">Habit Tracker</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentView(currentView === 'list' ? 'calendar' : 'list')}
          >
            {currentView === 'list' ? <CalendarIcon size={20} /> : <Check size={20} />}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="list" value={currentView} onValueChange={(value) => setCurrentView(value as 'list' | 'calendar')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="animate-fade-in">
          <div className="space-y-3 mb-6">
            {habits.map(habit => (
              <div key={habit.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`habit-${habit.id}`} 
                      checked={isHabitCompletedOnDate(habit.id, selectedDate || new Date())}
                      onCheckedChange={() => toggleHabitCompletion(habit.id)}
                      className="mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{habit.name}</h3>
                      <div className="flex items-center mt-1">
                        <Flame size={16} className="text-mood-peach mr-1" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Streak: {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
                    onClick={() => removeHabit(habit.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex mb-6">
            <input 
              type="text" 
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-l-lg p-2" 
              placeholder="Add new habit"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addHabit();
                }
              }}
            />
            <button 
              className="bg-mood-peach text-white px-4 py-2 rounded-r-lg"
              onClick={addHabit}
            >
              Add
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Select Date</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Habits for {selectedDate ? format(selectedDate, 'PPP') : 'Today'}</h3>
              {habits.length > 0 ? (
                habits.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex items-center">
                      <Checkbox 
                        id={`calendar-habit-${habit.id}`} 
                        checked={isHabitCompletedOnDate(habit.id, selectedDate || new Date())}
                        onCheckedChange={() => toggleHabitCompletion(habit.id)}
                        className="mr-3"
                      />
                      <label htmlFor={`calendar-habit-${habit.id}`} className="cursor-pointer">
                        {habit.name}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Flame size={16} className="text-mood-peach mr-1" />
                      <span className="text-sm">{habit.streak}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No habits added yet</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <TreeDeciduous size={20} className="mr-2 text-green-600" />
              <h3 className="font-medium">Your Forest</h3>
            </div>
            <div className="flex items-center">
              <Trophy size={16} className="text-yellow-500 mr-1" />
              <span>{treeCount} trees</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 my-2">
            {Array.from({ length: treeCount }).map((_, i) => (
              <span key={i} role="img" aria-label="tree" className="text-2xl animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>🌲</span>
            ))}
          </div>
          
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            Complete a habit for 7 days to plant a new tree!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Habits;
