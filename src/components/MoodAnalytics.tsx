
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MoodType } from './MoodSelector';
import {
  ChartContainer,
} from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export interface DailyMoodData {
  day: string;
  shortDay: string;
  mood: MoodType;
  value: number;
}

interface MoodAnalyticsProps {
  dailyMoods: DailyMoodData[];
  stabilityScore: number;
}

const MoodAnalytics: React.FC<MoodAnalyticsProps> = ({
  dailyMoods,
  stabilityScore
}) => {
  const getMoodColor = (mood: MoodType): string => {
    switch (mood) {
      case 'rad': return '#10b981'; // emerald-500
      case 'good': return '#22c55e'; // green-500
      case 'meh': return '#facc15'; // yellow-400
      case 'bad': return '#f87171'; // red-400
      case 'awful': return '#dc2626'; // red-600
      default: return '#d1d5db'; // gray-300
    }
  };

  const chartData = dailyMoods.map(day => ({
    name: day.shortDay,
    mood: day.mood,
    value: day.value
  }));

  // Generate random wave data for the stability graph
  const generateWaveData = () => {
    const points = 15;
    const middlePoint = 7;
    const maxDistance = 3;
    
    return Array.from({ length: points }, (_, i) => {
      const distanceFromMiddle = Math.abs(i - middlePoint);
      const randomFactor = Math.random() * maxDistance;
      return (maxDistance - distanceFromMiddle) * 0.5 + randomFactor;
    });
  };

  const waveData = generateWaveData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-gray-800 font-medium mb-2">Average Daily Mood</h3>
        
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 10 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis hide />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                minPointSize={3}
              >
                {chartData.map((entry, index) => (
                  <rect 
                    key={`rect-${index}`} 
                    fill={getMoodColor(entry.mood)} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="bg-orange-500 rounded-xl p-4 flex-1 shadow-sm text-white">
          <h3 className="text-white/90 font-medium text-sm">Mood Stability</h3>
          <div className="flex items-end mt-2">
            <div className="text-2xl font-bold">{stabilityScore}</div>
            <div className="text-lg">/100</div>
          </div>
        </div>
        
        <div className="bg-orange-500 rounded-xl p-4 flex-1 shadow-sm flex items-end">
          <div className="h-8 w-full flex items-end">
            {waveData.map((height, index) => (
              <div 
                key={index}
                className="bg-white w-1 mx-[1px]"
                style={{ height: `${height * 10}px` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics;
