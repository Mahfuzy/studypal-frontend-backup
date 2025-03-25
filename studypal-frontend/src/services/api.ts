import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'student' | 'instructor';
}

interface UserProfile {
  id: number;
  user_id: number;
  avatar_url: string;
  bio: string;
  study_preferences: {
    preferred_study_time: 'morning' | 'afternoon' | 'evening';
    study_duration: number;
    break_duration: number;
    preferred_subjects: string[];
  };
  notification_settings: {
    email_notifications: boolean;
    study_reminders: boolean;
    quiz_reminders: boolean;
    course_updates: boolean;
  };
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    date_earned: string;
  }>;
}

interface StudySession {
  id: number;
  user_id: number;
  course_id: number;
  start_time: string;
  end_time: string;
  duration: number;
  topic: string;
  notes: string;
  productivity_rating: number;
}

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  enrollment_date: string;
  status: 'active' | 'completed' | 'dropped';
  completion_percentage: number;
}

interface QuizAttempt {
  id: number;
  user_id: number;
  quiz_id: number;
  start_time: string;
  end_time: string;
  score: number;
  answers: Array<{
    question_id: number;
    selected_option: number;
    is_correct: boolean;
  }>;
}

interface StudyGoal {
  id: number;
  user_id: number;
  title: string;
  description: string;
  target_date: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
}

interface StudyStreak {
  id: number;
  user_id: number;
  current_streak: number;
  longest_streak: number;
  last_study_date: string;
  streak_history: Array<{
    date: string;
    duration: number;
  }>;
}

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

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 404) {
      console.error('Resource not found. Make sure JSON server is running on port 3001');
    }
    return Promise.reject(error);
  }
);

// Users
export const getUsers = () => api.get<User[]>('/users');
export const getUserById = (id: number) => api.get<User>(`/users/${id}`);
export const updateUser = (id: number, data: Partial<User>) => api.patch(`/users/${id}`, data);

// User Profiles
export const getUserProfile = (userId: number) => api.get<UserProfile>(`/user_profiles?user_id=${userId}`);
export const updateUserProfile = (id: number, data: Partial<UserProfile>) => 
  api.patch(`/user_profiles/${id}`, data);

// Study Sessions
export const getStudySessions = (userId: number) => api.get<StudySession[]>(`/study_sessions?user_id=${userId}`);
export const createStudySession = (data: Omit<StudySession, 'id'>) => api.post('/study_sessions', data);
export const updateStudySession = (id: number, data: Partial<StudySession>) => 
  api.patch(`/study_sessions/${id}`, data);

// Enrollments
export const getEnrollments = (userId: number) => api.get<Enrollment[]>(`/enrollments?user_id=${userId}`);
export const createEnrollment = (data: Omit<Enrollment, 'id'>) => api.post('/enrollments', data);
export const updateEnrollment = (id: number, data: Partial<Enrollment>) => 
  api.patch(`/enrollments/${id}`, data);

// Quiz Attempts
export const getQuizAttempts = (userId: number) => api.get<QuizAttempt[]>(`/quiz_attempts?user_id=${userId}`);
export const createQuizAttempt = (data: Omit<QuizAttempt, 'id'>) => api.post('/quiz_attempts', data);
export const updateQuizAttempt = (id: number, data: Partial<QuizAttempt>) => 
  api.patch(`/quiz_attempts/${id}`, data);

// Study Goals
export const getStudyGoals = (userId: number) => api.get<StudyGoal[]>(`/study_goals?user_id=${userId}`);
export const createStudyGoal = (data: Omit<StudyGoal, 'id'>) => api.post('/study_goals', data);
export const updateStudyGoal = (id: number, data: Partial<StudyGoal>) => 
  api.patch(`/study_goals/${id}`, data);

// Study Streaks
export const getStudyStreak = (userId: number) => api.get<StudyStreak>(`/study_streaks?user_id=${userId}`);
export const updateStudyStreak = (id: number, data: Partial<StudyStreak>) => 
  api.patch(`/study_streaks/${id}`, data);

// Courses
export const getCourses = () => api.get<Course[]>('/courses');
export const getCourseById = (id: number) => api.get<Course>(`/courses/${id}`);
export const createCourse = (data: Omit<Course, 'id'>) => api.post<Course>('/courses', data);
export const updateCourse = (id: number, data: Partial<Course>) => api.patch<Course>(`/courses/${id}`, data);
export const deleteCourse = (id: number) => api.delete(`/courses/${id}`);
export const updateCourseProgress = (id: number, progress: number) => 
  api.patch<Course>(`/courses/${id}`, { progress });

// Quizzes
export const getQuizzes = () => api.get('/quizzes');
export const getQuizById = (id: number) => api.get(`/quizzes/${id}`);
export const updateQuizStatus = (id: number, status: string) =>
  api.patch(`/quizzes/${id}`, { status });

// Study Assistant
export const getChatHistory = () => api.get('/chat_history');
export const addChatMessage = (message: { role: string; content: string }) =>
  api.post('/chat_history', {
    ...message,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  });

// Recommendations
export const getRecommendations = () => api.get('/recommendations');

export default api; 