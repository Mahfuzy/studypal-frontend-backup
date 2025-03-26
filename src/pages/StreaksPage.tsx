import { useState, useEffect } from 'react';
import { getStudyStreak } from '../services/api';

interface Streak {
  id: number;
  current_streak: number;
  longest_streak: number;
  last_study_date: string;
  total_study_time: number;
  weekly_goal: number;
  weekly_progress: number;
}

export default function StreaksPage() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const response = await getStudyStreak(1); // Using user ID 1 for now
        const totalTime = response.data.streak_history.reduce((acc, curr) => acc + curr.duration, 0);
        const weeklyTime = response.data.streak_history
          .filter(h => {
            const date = new Date(h.date);
            const now = new Date();
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return date >= weekAgo;
          })
          .reduce((acc, curr) => acc + curr.duration, 0);

        setStreak({
          ...response.data,
          total_study_time: Math.round(totalTime),
          weekly_goal: 20, // Default weekly goal in hours
          weekly_progress: Math.round(weeklyTime)
        });
      } catch (err) {
        setError('Failed to fetch streak data');
        console.error('Error fetching streak data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgress = (progress: number, goal: number) => {
    return Math.min((progress / goal) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!streak) {
    return null;
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Study Streaks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Streak */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Current Streak</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{streak.current_streak} days</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Longest Streak</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{streak.longest_streak} days</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Study Time */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Study Time</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{streak.total_study_time}h</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Last Study Date */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Last Study Date</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {formatDate(streak.last_study_date)}
              </h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Weekly Progress</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {streak.weekly_progress}/{streak.weekly_goal}h
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-red-200 rounded-full">
              <div
                className="h-2 bg-red-600 rounded-full"
                style={{ width: `${calculateProgress(streak.weekly_progress, streak.weekly_goal)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 