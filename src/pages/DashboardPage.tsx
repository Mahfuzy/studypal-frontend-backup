import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StudyStats {
  longestStreak: number;
  daysToExam: number;
  learningTime: string;
  completedCourses: number;
}

interface DailyActivity {
  day: string;
  studyMinutes: number;
  focusScore: number;
}

interface RecommendedCourse {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [stats] = useState<StudyStats>({
    longestStreak: 125,
    daysToExam: 78,
    learningTime: '8h 12m',
    completedCourses: 37
  });

  const [dailyActivity] = useState<DailyActivity[]>([
    { day: 'Mon', studyMinutes: 45, focusScore: 85 },
    { day: 'Tue', studyMinutes: 30, focusScore: 75 },
    { day: 'Wed', studyMinutes: 60, focusScore: 90 },
    { day: 'Thu', studyMinutes: 120, focusScore: 95 },
    { day: 'Fri', studyMinutes: 20, focusScore: 65 },
    { day: 'Sat', studyMinutes: 45, focusScore: 80 },
    { day: 'Sun', studyMinutes: 15, focusScore: 70 }
  ]);

  const [recommendedCourses] = useState<RecommendedCourse[]>([
    {
      id: 1,
      title: 'UX & Web Design: Strategy, Design Development',
      description: 'Learn how to apply User Experience(UX) principles to your website designs...',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    },
    {
      id: 2,
      title: 'Algebra:Calculus I,II & III',
      description: 'Learn to solve simple and complex equations involving calculus...',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    },
    {
      id: 3,
      title: 'Gamification:Motivation Psychology& Art of......',
      description: 'Learn how to motivate and engage anyone by learning the psychology...',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    }
  ]);

  const startQuiz = () => {
    navigate('/quiz');
  };

  const startAIChat = () => {
    navigate('/tae-ai');
  };

  return (
    <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold">{currentUser?.name || 'User'}</h2>
              <p className="text-gray-500">Ghana, Kumasi • Joined 2025</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">1231XP</span>
                <div className="w-32 sm:w-48 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-lg font-semibold">1300XP</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg">
                <span className="text-orange-500">🔥</span>
                <div>
                  <p className="font-semibold">36 Days streak!!</p>
                  <p className="text-sm text-gray-600">Keep studying to keep the streak going</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-purple-50 p-4 sm:p-6 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <span className="text-purple-600 text-xl">📈</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.longestStreak} Days</p>
                <p className="text-sm text-purple-600">Longest Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 sm:p-6 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-full">
                <span className="text-red-600 text-xl">⏰</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.daysToExam} Days</p>
                <p className="text-sm text-red-600">Countdown to exams</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 sm:p-6 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <span className="text-blue-600 text-xl">⌛</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.learningTime}</p>
                <p className="text-sm text-blue-600">Learning time</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 sm:p-6 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completedCourses}</p>
                <p className="text-sm text-green-600">Completed Courses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Activity Chart */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-semibold">Activity</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Study Time</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Focus Score</span>
                  </div>
                </div>
              </div>
              <div className="h-[200px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyActivity}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280' }}
                      domain={[0, 'dataMax + 20']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="studyMinutes" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="focusScore" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Take a Quiz Card */}
          <div>
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Take a Quiz?</h3>
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-gray-600 mb-4">
                Rack your brain on questions featuring what you've done so far.
              </p>
              <button
                onClick={startQuiz}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-semibold">AI-Recommendations</h3>
            <button
              onClick={startAIChat}
              className="w-full sm:w-auto px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Talk with AI
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {recommendedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <div className="h-32 bg-gray-200"></div>
                <div className="p-4">
                  <h4 className="font-semibold mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  <button className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    START
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}