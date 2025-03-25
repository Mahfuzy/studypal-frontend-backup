import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import axios from 'axios';

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
  completed_lessons: number;
  total_lessons: number;
  last_accessed: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface StudyStats {
  total_study_time: number;
  completed_courses: number;
  in_progress_courses: number;
  average_score: number;
  streak_days: number;
}

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  completion_percentage: number;
  last_accessed: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface Course {
  id: number;
  title: string;
  total_lessons: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export default function ProgressPage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [studyStats, setStudyStats] = useState<StudyStats>({
    total_study_time: 0,
    completed_courses: 0,
    in_progress_courses: 0,
    average_score: 0,
    streak_days: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Fetch enrollments for the current user
        const enrollmentsResponse = await axios.get<Enrollment[]>(`http://localhost:3000/enrollments?user_id=${currentUser?.id}`);
        const enrollments = enrollmentsResponse.data;

        // Fetch all courses
        const coursesResponse = await axios.get<Course[]>('http://localhost:3000/courses');
        const courses = coursesResponse.data;

        // Combine enrollments with course data
        const progressData = enrollments.map((enrollment) => {
          const course = courses.find((c) => c.id === enrollment.course_id);
          if (!course) {
            throw new Error(`Course not found for enrollment ${enrollment.id}`);
          }
          return {
            id: course.id,
            title: course.title,
            progress: enrollment.completion_percentage,
            completed_lessons: Math.floor((enrollment.completion_percentage / 100) * course.total_lessons),
            total_lessons: course.total_lessons,
            last_accessed: enrollment.last_accessed || new Date().toISOString(),
            status: enrollment.status
          };
        });

        setCourseProgress(progressData);

        // Calculate study stats
        const stats: StudyStats = {
          total_study_time: 45, // TODO: Calculate from study sessions
          completed_courses: enrollments.filter((e) => e.status === 'completed').length,
          in_progress_courses: enrollments.filter((e) => e.status === 'in_progress').length,
          average_score: 85, // TODO: Calculate from quiz attempts
          streak_days: 7 // TODO: Calculate from study streaks
        };

        setStudyStats(stats);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProgress();
    }
  }, [currentUser]);

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h1>

        {/* Study Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-blue-600">Total Study Time</h3>
            <p className="text-2xl font-bold text-blue-700 mt-2">{studyStats.total_study_time} hours</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-green-600">Completed Courses</h3>
            <p className="text-2xl font-bold text-green-700 mt-2">{studyStats.completed_courses}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-yellow-600">In Progress</h3>
            <p className="text-2xl font-bold text-yellow-700 mt-2">{studyStats.in_progress_courses}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-purple-600">Average Score</h3>
            <p className="text-2xl font-bold text-purple-700 mt-2">{studyStats.average_score}%</p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-red-600">Streak Days</h3>
            <p className="text-2xl font-bold text-red-700 mt-2">{studyStats.streak_days}</p>
          </div>
        </div>

        {/* Course Progress */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Course Progress</h2>
          <div className="space-y-6">
            {courseProgress.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="bg-gray-50 p-6 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      Last accessed: {new Date(course.last_accessed).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      course.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : course.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {course.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {course.completed_lessons} of {course.total_lessons} lessons completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 