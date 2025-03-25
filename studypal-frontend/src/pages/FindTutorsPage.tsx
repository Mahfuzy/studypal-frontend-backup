import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, User } from '../services/userService';

interface TutorFilters {
  subject: string;
  maxRate: number;
}

export default function FindTutorsPage() {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TutorFilters>({
    subject: '',
    maxRate: 100
  });

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Literature',
    'History',
    'Economics'
  ];

  useEffect(() => {
    loadTutors();
  }, [filters]);

  const loadTutors = async () => {
    setLoading(true);
    const fetchedTutors = await userService.getTutors(filters);
    setTutors(fetchedTutors);
    setLoading(false);
  };

  const handleStartChat = (tutorId: number) => {
    navigate(`/messages?userId=${tutorId}`);
  };

  return (
    <div className="flex-1 bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Find Tutors</h1>
          <p className="text-gray-600">Connect with expert tutors in your field of study</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Hourly Rate ($)
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={filters.maxRate}
                onChange={(e) => setFilters(prev => ({ ...prev, maxRate: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">${filters.maxRate}/hour</div>
            </div>
          </div>
        </div>

        {/* Tutors Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {tutor.avatar ? (
                        <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl text-gray-400">👤</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{tutor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">${tutor.hourlyRate}/hour</p>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">{tutor.rating}/5</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tutor.subjects?.map((subject) => (
                        <span
                          key={subject}
                          className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{tutor.aboutMe}</p>
                    <button
                      onClick={() => handleStartChat(tutor.id)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Message Tutor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 