import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import SchedulePage from './pages/SchedulePage';
import SettingsPage from './pages/SettingsPage';
import TaeAIPage from './pages/TaeAIPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CoursesPage from './pages/CoursesPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizDetailsPage from './pages/QuizDetailsPage';
import StudyAssistantPage from './pages/StudyAssistantPage';
import StreaksPage from './pages/StreaksPage';
import ProfilePage from './pages/ProfilePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import CreateCoursePage from './pages/CreateCoursePage';
import StudySessionList from './components/sessions/StudySessionList';
import TaskList from './components/tasks/TaskList';
import NoteList from './components/notes/NoteList';
import FlashcardList from './components/flashcards/FlashcardList';
import './App.css';
import ProgressPage from './pages/ProgressPage';
import MessagesPage from './pages/MessagingPage';
import { authService } from './services/auth';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import FindTutorsPage from './pages/FindTutorsPage';
import { AuthProvider } from './contexts/AuthContext';
import { MessagingProvider } from './contexts/MessagingContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isAuthenticated = authService.getCurrentUser() !== null;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <MessagingProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <HomePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SchedulePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CoursesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CourseDetailsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/create"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateCoursePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <QuizzesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quizzes/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <QuizDetailsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-assistant"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <StudyAssistantPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/streaks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <StreaksPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProgressPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tae-ai"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaeAIPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MessagesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:chatId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MessagesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* New components */}
              <Route
                path="/sessions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <StudySessionList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <NoteList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flashcards"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FlashcardList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <QuizPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Add this route in the protected routes section */}
              <Route
                path="/find-tutors"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FindTutorsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MessagingProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
