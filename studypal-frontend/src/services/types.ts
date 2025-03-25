export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface StudySession {
  id: number;
  userId: number;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Task {
  id: number;
  userId: number;
  sessionId: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}

export interface Note {
  id: number;
  userId: number;
  sessionId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: number;
  userId: number;
  subject: string;
  question: string;
  answer: string;
  lastReviewed: string;
  nextReview: string;
} 