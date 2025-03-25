import { useState } from 'react';

interface ScheduledSession {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<string>('12');
  const [viewMode, setViewMode] = useState<string>('Weekly');
  
  const days = [
    { date: '10', day: 'Mon' },
    { date: '11', day: 'Tue' },
    { date: '12', day: 'Wed' },
    { date: '13', day: 'Thu' },
    { date: '14', day: 'Fri' }
  ];

  const scheduledSessions: ScheduledSession[] = [
    {
      id: 1,
      title: 'Introduction to AI',
      description: 'Lets dive into the world of AI and see...',
      startTime: '8:00AM',
      endTime: '08:42AM',
      duration: 42
    },
    {
      id: 2,
      title: 'UI Principles', 
      description: 'Get a grasp understanding of the diverse princ.....',
      startTime: '9:00AM',
      endTime: '09:42AM',
      duration: 42
    },
    {
      id: 3,
      title: 'World of Economics',
      description: 'A short course to help better your understanding....',
      startTime: '10:00AM',
      endTime: '10:21AM',
      duration: 21
    },
    {
      id: 4,
      title: 'Machine Learning',
      description: 'Deep dive into machine learning, data mining......',
      startTime: '10:30AM',
      endTime: '11:00AM',
      duration: 30
    }
  ];

  return (
    <div className="flex-1 bg-white p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-semibold">February 2025</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('Weekly')}
              className={`px-3 sm:px-4 py-1 rounded-lg text-sm sm:text-base ${
                viewMode === 'Weekly'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Weekly
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200">
              <span className="text-gray-600">⌄</span>
            </button>
          </div>
        </div>

        {/* Days Row */}
        <div className="grid grid-cols-3 sm:flex gap-2 sm:space-x-4 mb-6 sm:mb-8">
          {days.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className={`p-2 sm:p-4 rounded-xl flex flex-col items-center ${
                selectedDate === day.date
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <span className="text-base sm:text-lg font-semibold">{day.date}</span>
              <span className={`text-xs sm:text-sm ${
                selectedDate === day.date ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {day.day}
              </span>
            </button>
          ))}
          <button className="p-2 sm:p-4 rounded-xl flex flex-col items-center justify-center border border-gray-200">
            <span className="text-gray-400">→</span>
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-3 sm:space-y-4">
          {scheduledSessions.map((session) => (
            <div key={session.id} className="flex items-start space-x-2 sm:space-x-4">
              <div className="w-16 sm:w-24 pt-2">
                <span className="text-xs sm:text-sm text-gray-500">{session.startTime}</span>
              </div>
              <div className="flex-1 bg-purple-50 rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <h3 className="font-semibold text-purple-900 text-sm sm:text-base">{session.title}</h3>
                  <span className="text-xs sm:text-sm text-purple-600">{session.duration} mins</span>
                </div>
                <p className="text-xs sm:text-sm text-purple-700">{session.description}</p>
                <div className="mt-2 text-xs sm:text-sm text-purple-600">
                  {session.startTime}-{session.endTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 