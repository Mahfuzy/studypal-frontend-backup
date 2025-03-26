import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../services/api';
import { authService } from '../services/auth';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    total_lessons: 0,
    category: '',
    prerequisites: [] as string[],
    tags: [] as string[],
    image_url: '',
    syllabus: [] as Array<{
      week: number;
      topic: string;
      description: string;
      completed: boolean;
    }>
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'prerequisites' | 'tags') => {
    const items = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSyllabusChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((week, i) =>
        i === index ? { ...week, [field]: value } : week
      )
    }));
  };

  const addSyllabusWeek = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [
        ...prev.syllabus,
        {
          week: prev.syllabus.length + 1,
          topic: '',
          description: '',
          completed: false
        }
      ]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          image_url: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError('You must be logged in to create a course');
      return;
    }

    try {
      const courseData = {
        ...formData,
        instructor_id: currentUser.id,
        instructor: currentUser.name,
        progress: 0,
        completed_lessons: 0,
        status: 'not_started' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const response = await createCourse(courseData);
      navigate(`/courses/${response.data.id}`);
    } catch (err) {
      setError('Failed to create course');
      console.error('Error creating course:', err);
    }
  };

  if (!currentUser || currentUser.role !== 'instructor') {
    return (
      <div className="flex-1 bg-white rounded-3xl p-8">
        <div className="text-red-500">Only instructors can create courses.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Course</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Course preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 p-2"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload a course image (JPG, PNG, GIF)
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (e.g., "12 weeks")</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prerequisites (comma-separated)</label>
            <input
              type="text"
              value={formData.prerequisites.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'prerequisites')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'tags')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Syllabus</h2>
              <button
                type="button"
                onClick={addSyllabusWeek}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Week
              </button>
            </div>
            <div className="space-y-4">
              {formData.syllabus.map((week, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Week {week.week}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Topic</label>
                      <input
                        type="text"
                        value={week.topic}
                        onChange={(e) => handleSyllabusChange(index, 'topic', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={week.description}
                        onChange={(e) => handleSyllabusChange(index, 'description', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}