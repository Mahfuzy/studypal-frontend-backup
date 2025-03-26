import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses } from '../services/api';
import { authService } from '../services/auth';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  progress: number;
  total_lessons: number;
  completed_lessons: number;
  image_url: string;
  status: string;
  category: string;
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-3xl p-8">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-white rounded-3xl p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
          {currentUser?.role === 'instructor' && (
            <Link
              to="/courses/create"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Course
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">{course.category}</span>
                  <span className="text-sm text-gray-500">{course.duration}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    by {course.instructor}
                  </span>
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {course.status}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {course.completed_lessons} of {course.total_lessons} lessons completed
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>No courses available.</p>
            {currentUser?.role === 'instructor' && (
              <p className="mt-2">
                Click the "Create Course" button above to add your first course.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 