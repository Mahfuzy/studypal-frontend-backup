import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateCourse, deleteCourse } from '../services/api';
import { authService } from '../services/auth';

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
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const currentUser = authService.getCurrentUser();

  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    duration: '',
    total_lessons: 0,
    category: '',
    prerequisites: [],
    tags: []
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) throw new Error('No course ID provided');
        const response = await getCourseById(parseInt(id));
        setCourse(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          duration: response.data.duration,
          total_lessons: response.data.total_lessons,
          category: response.data.category,
          prerequisites: response.data.prerequisites || [],
          tags: response.data.tags || []
        });
      } catch (err) {
        setError('Failed to fetch course details');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ... rest of the component code ...

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      {/* ... existing JSX ... */}
      {!isEditing && course && (
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

            {/* ... rest of the display JSX ... */}
          </div>
        </div>
      )}
    </div>
  );
} 