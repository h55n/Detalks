
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Moon, Sun, Music, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/AnimatedBackground';

// Define interfaces for our data
interface Track {
  id: number;
  title: string;
  duration: string;
  artist?: string;
}

interface Genre {
  id: string;
  name: string;
  description: string;
  color: string;
  accentColor: string;
  tracks: Track[];
}

const CalmingRoom = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [volume, setVolume] = useState(80);
  const [activeGenre, setActiveGenre] = useState<string>('nature');
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // Music genres data
  const genres: Genre[] = [
    {
      id: 'nature',
      name: 'Nature Sounds',
      description: 'Immerse yourself in peaceful natural environments',
      color: 'from-brand-green/80 to-brand-plum/50',
      accentColor: 'brand-green',
      tracks: [
        { id: 1, title: 'Ocean Waves', duration: '5:30' },
        { id: 2, title: 'Forest Ambience', duration: '4:45' },
        { id: 3, title: 'Gentle Rain', duration: '6:15' },
        { id: 4, title: 'Mountain Stream', duration: '3:50' }
      ]
    },
    {
      id: 'meditation',
      name: 'Meditation',
      description: 'Calm your mind with guided meditation tracks',
      color: 'from-brand-plum/80 to-brand-pink/40',
      accentColor: 'brand-plum',
      tracks: [
        { id: 1, title: 'Deep Breathing', duration: '8:20' },
        { id: 2, title: 'Body Scan', duration: '12:15' },
        { id: 3, title: 'Mindful Awareness', duration: '10:45' },
        { id: 4, title: 'Stress Relief', duration: '15:30' }
      ]
    },
    {
      id: 'ambient',
      name: 'Ambient',
      description: 'Atmospheric sounds to create a soothing space',
      color: 'from-brand-yellow/70 to-brand-orange/30',
      accentColor: 'brand-yellow',
      tracks: [
        { id: 1, title: 'Soft Piano', duration: '3:50' },
        { id: 2, title: 'Space Dreams', duration: '5:25' },
        { id: 3, title: 'Twilight Serenity', duration: '7:40' },
        { id: 4, title: 'Floating', duration: '6:10' }
      ]
    },
    {
      id: 'lofi',
      name: 'Lo-Fi Beats',
      description: 'Relaxed beats perfect for focus and calm',
      color: 'from-brand-pink/70 to-brand-orange/50',
      accentColor: 'brand-pink',
      tracks: [
        { id: 1, title: 'Study Session', duration: '4:20' },
        { id: 2, title: 'Rainy Day', duration: '3:45' },
        { id: 3, title: 'Late Night', duration: '5:15' },
        { id: 4, title: 'Chill Vibes', duration: '4:30' }
      ]
    }
  ];
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };
  
  // Apply dark mode class if state is true
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const selectTrack = (trackId: number) => {
    setActiveTrack(trackId);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    const currentGenre = genres.find(g => g.id === activeGenre);
    if (!currentGenre) return;
    
    if (activeTrack === null) {
      setActiveTrack(currentGenre.tracks[0].id);
      setIsPlaying(true);
      return;
    }
    
    const currentIndex = currentGenre.tracks.findIndex(track => track.id === activeTrack);
    const nextIndex = (currentIndex + 1) % currentGenre.tracks.length;
    setActiveTrack(currentGenre.tracks[nextIndex].id);
    setIsPlaying(true);
  };
  
  const handlePrevTrack = () => {
    const currentGenre = genres.find(g => g.id === activeGenre);
    if (!currentGenre) return;
    
    if (activeTrack === null) {
      setActiveTrack(currentGenre.tracks[0].id);
      setIsPlaying(true);
      return;
    }
    
    const currentIndex = currentGenre.tracks.findIndex(track => track.id === activeTrack);
    const prevIndex = (currentIndex - 1 + currentGenre.tracks.length) % currentGenre.tracks.length;
    setActiveTrack(currentGenre.tracks[prevIndex].id);
    setIsPlaying(true);
  };
  
  const activeGenreData = genres.find(g => g.id === activeGenre) || genres[0];
  
  return (
    <div className={`page-container transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/" className={`mr-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-icon-purple transition-colors duration-200`}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Calming Room
          </h1>
        </div>
        
        <button 
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-200 text-gray-700'} transition-all duration-300 hover:scale-105`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="mb-6">
        <div className="rounded-xl h-64 relative overflow-hidden shadow-md group">
          <AnimatedBackground 
            className={`bg-gradient-to-br ${activeGenreData.color} transition-all duration-1000`} 
            currentGenre={activeGenre}
            isPlaying={isPlaying}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white">
            <div className="text-center p-5 backdrop-blur-sm bg-black/10 rounded-xl w-3/4 transition-all duration-300 transform group-hover:scale-105">
              <h2 className="text-2xl font-medium mb-2 text-white drop-shadow-md">{activeGenreData.name}</h2>
              <p className="text-white/90 drop-shadow text-sm">{activeGenreData.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <Select 
          value={activeGenre} 
          onValueChange={setActiveGenre}
        >
          <SelectTrigger className={`w-full ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}>
            <SelectValue placeholder="Select a genre" />
          </SelectTrigger>
          <SelectContent className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
            {genres.map(genre => (
              <SelectItem key={genre.id} value={genre.id}>
                <div className="flex items-center">
                  <Music size={16} className={`mr-2 text-${genre.accentColor}`} />
                  {genre.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-20">
        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="w-full mb-4 bg-transparent border-b border-gray-200 dark:border-gray-700 flex justify-around">
            <TabsTrigger 
              value="tracks" 
              className={`flex-1 ${darkMode ? 'text-gray-300 data-[state=active]:text-white' : 'text-gray-700 data-[state=active]:text-gray-900'} data-[state=active]:border-b-2 data-[state=active]:border-brand-plum`}
            >
              Tracks
            </TabsTrigger>
            <TabsTrigger 
              value="featured" 
              className={`flex-1 ${darkMode ? 'text-gray-300 data-[state=active]:text-white' : 'text-gray-700 data-[state=active]:text-gray-900'} data-[state=active]:border-b-2 data-[state=active]:border-brand-plum`}
            >
              Featured
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracks" className="space-y-3">
            {activeGenreData.tracks.map((track) => (
              <TrackItem 
                key={track.id}
                track={track} 
                isActive={activeTrack === track.id}
                isPlaying={isPlaying && activeTrack === track.id}
                darkMode={darkMode}
                accentColor={activeGenreData.accentColor}
                onClick={() => selectTrack(track.id)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="featured" className="space-y-3">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <h3 className={`font-medium ${darkMode ? 'text-white' : ''}`}>Featured Collections</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Curated playlists coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <PlayerControls 
        isPlaying={isPlaying}
        darkMode={darkMode}
        volume={volume}
        accentColor={activeGenreData.accentColor}
        onPlay={togglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onVolumeChange={setVolume}
      />
    </div>
  );
};

interface TrackItemProps {
  track: Track;
  isActive: boolean;
  isPlaying: boolean;
  darkMode: boolean;
  accentColor: string;
  onClick: () => void;
}

const TrackItem = ({ track, isActive, isPlaying, darkMode, accentColor, onClick }: TrackItemProps) => {
  return (
    <div 
      className={`p-4 rounded-xl flex justify-between items-center transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
        isActive 
          ? darkMode 
            ? `bg-${accentColor}/30 shadow-md` 
            : `bg-${accentColor}/20 shadow-md` 
          : darkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-100'
      }`}
      onClick={onClick}
    >
      <div>
        <h3 className={`font-medium ${darkMode ? 'text-white' : ''}`}>{track.title}</h3>
        <span className={`text-sm ${
          isActive 
            ? darkMode 
              ? 'text-gray-300' 
              : 'text-gray-600' 
            : darkMode 
              ? 'text-gray-400' 
              : 'text-gray-500'
        }`}>{track.duration}</span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? `bg-${accentColor} hover:bg-${accentColor}/90` 
            : darkMode 
              ? `bg-${accentColor}/20 hover:bg-${accentColor}/30` 
              : `bg-${accentColor}/10 hover:bg-${accentColor}/20`
        }`}
      >
        {isPlaying && isActive ? (
          <Pause size={18} className={`${isActive ? 'text-white' : darkMode ? `text-${accentColor}` : `text-${accentColor}`}`} />
        ) : (
          <Play size={18} className={`ml-0.5 ${isActive ? 'text-white' : darkMode ? `text-${accentColor}` : `text-${accentColor}`}`} />
        )}
      </Button>
    </div>
  );
};

interface PlayerControlsProps {
  isPlaying: boolean;
  darkMode: boolean;
  volume: number;
  accentColor: string;
  onPlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange: (value: number) => void;
}

const PlayerControls = ({ 
  isPlaying, 
  darkMode, 
  volume,
  accentColor,
  onPlay, 
  onNext, 
  onPrev,
  onVolumeChange
}: PlayerControlsProps) => {
  return (
    <div className={`fixed bottom-20 left-0 right-0 px-4 py-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Volume slider */}
      <div className="flex items-center justify-center mb-4">
        <Volume2 size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className={`w-32 mx-2 accent-${accentColor}`}
        />
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{volume}%</span>
      </div>
      
      {/* Playback controls */}
      <div className="flex justify-center space-x-4">
        <Button 
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 transform hover:scale-105 ${
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={onPrev}
        >
          <SkipBack size={20} className="transition-transform" />
        </Button>
        <Button 
          variant="ghost"
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all duration-300 transform hover:scale-105 ${
            darkMode ? `bg-${accentColor} text-white` : `bg-${accentColor} text-white`
          }`}
          onClick={onPlay}
        >
          {isPlaying ? (
            <Pause size={28} className="transition-transform" />
          ) : (
            <Play size={28} className="ml-1 transition-transform" />
          )}
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 transform hover:scale-105 ${
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={onNext}
        >
          <SkipForward size={20} className="transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default CalmingRoom;
