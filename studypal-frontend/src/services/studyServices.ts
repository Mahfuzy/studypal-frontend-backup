import api from './api';
import { User, StudySession, Task, Note, Flashcard } from './types';

// User Services
export const userService = {
  getUsers: () => api.get<User[]>('/users'),
  getUser: (id: number) => api.get<User>(`/users/${id}`),
  createUser: (user: Omit<User, 'id'>) => api.post<User>('/users', user),
  updateUser: (id: number, user: Partial<User>) => api.put<User>(`/users/${id}`, user),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

// Study Session Services
export const sessionService = {
  getSessions: () => api.get<StudySession[]>('/studySessions'),
  getSession: (id: number) => api.get<StudySession>(`/studySessions/${id}`),
  createSession: (session: Omit<StudySession, 'id'>) => api.post<StudySession>('/studySessions', session),
  updateSession: (id: number, session: Partial<StudySession>) => api.put<StudySession>(`/studySessions/${id}`, session),
  deleteSession: (id: number) => api.delete(`/studySessions/${id}`),
};

// Task Services
export const taskService = {
  getTasks: () => api.get<Task[]>('/tasks'),
  getTask: (id: number) => api.get<Task>(`/tasks/${id}`),
  createTask: (task: Omit<Task, 'id'>) => api.post<Task>('/tasks', task),
  updateTask: (id: number, task: Partial<Task>) => api.put<Task>(`/tasks/${id}`, task),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

// Note Services
export const noteService = {
  getNotes: () => api.get<Note[]>('/notes'),
  getNote: (id: number) => api.get<Note>(`/notes/${id}`),
  createNote: (note: Omit<Note, 'id'>) => api.post<Note>('/notes', note),
  updateNote: (id: number, note: Partial<Note>) => api.put<Note>(`/notes/${id}`, note),
  deleteNote: (id: number) => api.delete(`/notes/${id}`),
};

// Flashcard Services
export const flashcardService = {
  getFlashcards: () => api.get<Flashcard[]>('/flashcards'),
  getFlashcard: (id: number) => api.get<Flashcard>(`/flashcards/${id}`),
  createFlashcard: (flashcard: Omit<Flashcard, 'id'>) => api.post<Flashcard>('/flashcards', flashcard),
  updateFlashcard: (id: number, flashcard: Partial<Flashcard>) => api.put<Flashcard>(`/flashcards/${id}`, flashcard),
  deleteFlashcard: (id: number) => api.delete(`/flashcards/${id}`),
}; 