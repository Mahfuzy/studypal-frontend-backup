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
          prerequisites: response.data.prerequisites,
          tags: response.data.tags
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handlePrerequisitesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prerequisites = e.target.value.split(',').map(prereq => prereq.trim());
    setFormData(prev => ({
      ...prev,
      prerequisites
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!id || !course) throw new Error('No course data');
      const response = await updateCourse(parseInt(id), formData);
      setCourse(response.data);
      setIsEditing(false);
      setSuccess('Course updated successfully!');
    } catch (err) {
      setError('Failed to update course');
      console.error('Error updating course:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      if (!id) throw new Error('No course ID provided');
      await deleteCourse(parseInt(id));
      navigate('/courses');
    } catch (err) {
      setError('Failed to delete course');
      console.error('Error deleting course:', err);
    }
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

  if (!course) return null;

  const canEdit = currentUser?.role === 'instructor' || currentUser?.id === course.instructor_id;

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Course Details</h1>
          {canEdit && (
            <div className="space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Course'}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Course
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Lessons</label>
              <input
                type="number"
                name="total_lessons"
                value={formData.total_lessons}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prerequisites (comma-separated)</label>
              <input
                type="text"
                name="prerequisites"
                value={formData.prerequisites?.join(', ')}
                onChange={handlePrerequisitesChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags?.join(', ')}
                onChange={handleTagsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </form>
        ) : (
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

              <div>
                <h2 className="text-sm font-medium text-gray-500">Duration</h2>
                <p className="mt-1 text-lg text-gray-900">{course.duration}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Category</h2>
                <p className="mt-1 text-lg text-gray-900">{course.category}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Progress</h2>
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {course.completed_lessons} of {course.total_lessons} lessons completed
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500">Status</h2>
                <p className="mt-1 text-lg text-gray-900 capitalize">{course.status}</p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Description</h2>
              <p className="mt-1 text-lg text-gray-900">{course.description}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Prerequisites</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {course.prerequisites?.map((prereq, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Tags</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {course.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Syllabus</h2>
              <div className="space-y-4">
                {course.syllabus?.map((week, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Week {week.week}: {week.topic}
                      </h3>
                      {week.completed ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-600">{week.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 