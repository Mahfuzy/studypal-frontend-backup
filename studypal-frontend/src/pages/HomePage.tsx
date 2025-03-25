import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

interface UnfinishedCourse {
  id: number;
  title: string;
  instructor: string;
  instructor_avatar: string;
  duration: string;
  image_url: string;
}

interface CourseCard {
  id: number;
  title: string;
  instructor: string;
  instructor_avatar: string;
  image_url: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const unfinishedCourses: UnfinishedCourse[] = [
    {
      id: 1,
      title: 'Learning how to create simple Swift applications in 8 lessons',
      instructor: 'Dr. Linda',
      instructor_avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      duration: '52 min',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    },
    {
      id: 2,
      title: 'Best tips for drawing some good thematic illustration',
      instructor: 'Dianne Edwards',
      instructor_avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      duration: '90 min',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    }
  ];

  const otherCourses: CourseCard[] = [
    {
      id: 3,
      title: 'Python Programming Basics',
      instructor: 'John Smith',
      instructor_avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    },
    {
      id: 4,
      title: 'Web Development Fundamentals',
      instructor: 'Sarah Johnson',
      instructor_avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    },
    {
      id: 5,
      title: 'UI/UX Design Principles',
      instructor: 'Mike Chen',
      instructor_avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    }
  ];

  return (
    <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {currentUser?.name}! 👋</h1>
            <p className="text-gray-600">Ready to continue your learning journey?</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto group relative px-4 py-3 sm:py-4 bg-purple-600 text-white rounded-xl sm:rounded-2xl overflow-hidden hover:scale-105 transition-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-base sm:text-lg font-semibold">Go to Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>

        {/* Unfinished Courses */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Your unfinished courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {unfinishedCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                    <img
                      src={course.instructor_avatar}
                      alt={course.instructor}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white"
                    />
                    <span className="text-sm sm:text-base text-white font-medium">{course.instructor}</span>
                    <span className="text-sm sm:text-base text-white/80">{course.duration}</span>
                  </div>
                  <h3 className="text-white text-lg sm:text-xl font-semibold">{course.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Other Courses */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Start other courses</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {otherCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="group rounded-xl overflow-hidden cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="relative h-32">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2">
                    <img
                      src={course.instructor_avatar}
                      alt={course.instructor}
                      className="w-6 h-6 rounded-full border-2 border-white"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{course.instructor}</p>
                </div>
              </div>
            ))}
            <div
              onClick={() => navigate('/courses')}
              className="group rounded-xl overflow-hidden cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow bg-gray-50 flex items-center justify-center min-h-[160px]"
            >
              <div className="text-center p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-purple-600">View All Courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 