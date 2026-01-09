
import React from 'react';
import { ArrowLeft, UserCircle, Calendar, MessageSquare, BookOpen, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MoodSelector from '@/components/MoodSelector';
import WellnessCard from '@/components/WellnessCard';

const Professional = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center">
          <button
            className="mr-4 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Professional Support</h1>
            <p className="text-gray-600 dark:text-gray-400">Connect with licensed experts</p>
          </div>
        </div>
        <Link to="/profile">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <UserCircle className="text-gray-600 dark:text-gray-400" size={22} />
          </div>
        </Link>
      </div>
      
      <MoodSelector />
      
      <div className="flex mb-6 space-x-4 animate-fade-in">
        <Link
          to="/"
          className="flex-1 py-3 px-4 rounded-xl transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Self-Guided
        </Link>
        <button
          className="flex-1 py-3 px-4 rounded-xl transition-all bg-icon-purple dark:bg-icon-purple-light text-white dark:text-gray-900"
        >
          Professional
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in">
        <WellnessCard
          icon={UserCircle}
          title="Therapists"
          backgroundColor="bg-soft-purple dark:bg-indigo-900/60"
          to="/therapists"
        />
        <WellnessCard
          icon={Calendar}
          title="Appointments"
          backgroundColor="bg-soft-peach dark:bg-amber-900/60"
          to="/appointment"
        />
        <WellnessCard
          icon={MessageSquare}
          title="Secure Chat"
          backgroundColor="bg-soft-green dark:bg-green-900/60"
          to="/secure-chat"
        />
        <WellnessCard
          icon={FileText}
          title="Assessment"
          backgroundColor="bg-soft-yellow dark:bg-yellow-900/60"
          to="/resources"
        />
        <WellnessCard
          icon={BookOpen}
          title="Resources"
          backgroundColor="bg-soft-blue dark:bg-blue-900/60"
          to="/resources"
        />
      </div>
    </div>
  );
};

export default Professional;
