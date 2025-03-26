import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../services/api';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor_id?: number;
  instructor: string;
  duration: string;
  progress: number;
  total_lessons: number;
  completed_lessons: number;
  image_url: string;
  status: 'not_started' | 'in_progress' | 'completed';
  category: string;
  syllabus?: Array<{
    week: number;
    topic: string;
    description: string;
    completed: boolean;
  }>;
  prerequisites?: string[];
  tags?: string[];
}

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) throw new Error('No course ID provided');
        const response = await getCourseById(parseInt(id));
        setCourse(response.data);
      } catch (err) {
        setError('Failed to fetch course details');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      {course && (
        <div className="space-y-8">
          <div>
            <img
              src={course.image_url}
              alt={course.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Title</h2>
              <p className="mt-1 text-lg text-gray-900">{course.title}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Instructor</h2>
              <p className="mt-1 text-lg text-gray-900">{course.instructor}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}