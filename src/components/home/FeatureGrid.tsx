
import React from 'react';
import { LucideIcon, Moon, TreeDeciduous, Cloud, BookOpen, MessageSquare, Wind, UserCircle, Calendar, Heart } from 'lucide-react';
import WellnessCard from '@/components/WellnessCard';

// Define interface for feature items
interface FeatureItem {
  icon: LucideIcon;
  title: string;
  path: string;
  backgroundColor: string;
  iconColor: string;
}

interface FeatureGridProps {
  type: 'self-guided' | 'professional';
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ type }) => {
  // Define feature colors for self-guided section
  const selfGuidedColors = {
    mood: "#BEB1CB",      // Plum Point
    habits: "#C8DE7A",    // Kowloon
    calming: "#F9B8D3",   // Pink Quartz
    journal: "#FDBE2A",   // Extreme Yellow
    aiChat: "#F14C27",    // Burning Orange
    breathing: "#AB8E25", // Sahara
  };

  // Define feature colors for professional section  
  const professionalColors = {
    therapists: "#BEB1CB",  // Plum Point
    appointments: "#F9B8D3", // Pink Quartz
    secureChat: "#F14C27",   // Burning Orange
    resources: "#FDBE2A",    // Extreme Yellow
  };

  // Define features for self-guided section
  const selfGuidedFeatures: FeatureItem[] = [
    {
      icon: Moon,
      title: "Track Mood",
      path: "/mood",
      backgroundColor: "bg-brand-plum/30 dark:bg-brand-plum/20",
      iconColor: selfGuidedColors.mood
    },
    {
      icon: TreeDeciduous,
      title: "Habits",
      path: "/habits",
      backgroundColor: "bg-brand-green/30 dark:bg-brand-green/20",
      iconColor: selfGuidedColors.habits
    },
    {
      icon: Cloud,
      title: "Calming Room",
      path: "/calming-room",
      backgroundColor: "bg-brand-pink/30 dark:bg-brand-pink/20",
      iconColor: selfGuidedColors.calming
    },
    {
      icon: BookOpen,
      title: "Journal",
      path: "/journal",
      backgroundColor: "bg-brand-yellow/30 dark:bg-brand-yellow/20",
      iconColor: selfGuidedColors.journal
    },
    {
      icon: MessageSquare,
      title: "AI Chat",
      path: "/ai-chat",
      backgroundColor: "bg-brand-orange/30 dark:bg-brand-orange/20",
      iconColor: selfGuidedColors.aiChat
    },
    {
      icon: Wind,
      title: "Breathing",
      path: "/breathing",
      backgroundColor: "bg-brand-gold/30 dark:bg-brand-gold/20",
      iconColor: selfGuidedColors.breathing
    }
  ];

  // Define features for professional section
  const professionalFeatures: FeatureItem[] = [
    {
      icon: UserCircle,
      title: "Therapists",
      path: "/therapists",
      backgroundColor: "bg-brand-plum/30 dark:bg-brand-plum/20",
      iconColor: professionalColors.therapists
    },
    {
      icon: Calendar,
      title: "Appointments",
      path: "/appointment",
      backgroundColor: "bg-brand-pink/30 dark:bg-brand-pink/20",
      iconColor: professionalColors.appointments
    },
    {
      icon: MessageSquare,
      title: "Secure Chat",
      path: "/secure-chat",
      backgroundColor: "bg-brand-orange/30 dark:bg-brand-orange/20",
      iconColor: professionalColors.secureChat
    },
    {
      icon: BookOpen,
      title: "Resources",
      path: "/resources",
      backgroundColor: "bg-brand-yellow/30 dark:bg-brand-yellow/20",
      iconColor: professionalColors.resources
    }
  ];

  const features = type === 'self-guided' ? selfGuidedFeatures : professionalFeatures;

  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in">
      {features.map((feature, index) => (
        <WellnessCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          backgroundColor={feature.backgroundColor}
          iconColor={feature.iconColor}
          to={feature.path}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
