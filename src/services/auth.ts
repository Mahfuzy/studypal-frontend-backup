import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  created_at?: string;
  last_login?: string;
  password?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // First, get the user by email
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;
      const user = users.find((u: User) => u.email === credentials.email);

      if (!user) {
        throw new Error('User not found');
      }

      // Check password
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }

      // Update last login
      const updatedUser = await axios.patch(`${API_URL}/users/${user.id}`, {
        last_login: new Date().toISOString()
      });

      // Store user without sensitive data
      const { password, ...userWithoutPassword } = updatedUser.data;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  }

  async register(data: RegisterData): Promise<User> {
    const newUser = {
      ...data,
      role: 'student',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };

    const response = await axios.post(`${API_URL}/users`, newUser);
    const { ...userWithoutPassword } = response.data;
    delete userWithoutPassword.password;
    
    // Create user profile
    await axios.post(`${API_URL}/user_profiles`, {
      user_id: response.data.id,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`,
      bio: '',
      study_preferences: {
        preferred_study_time: 'morning',
        study_duration: 45,
        break_duration: 15,
        preferred_subjects: []
      },
      notification_settings: {
        email_notifications: true,
        study_reminders: true,
        quiz_reminders: true,
        course_updates: true
      },
      achievements: []
    });

    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  async updateProfile(userId: number, data: Partial<User>): Promise<User> {
    const response = await axios.patch(`${API_URL}/users/${userId}`, data);
    const { ...userWithoutPassword } = response.data;
    delete userWithoutPassword.password;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
}

export const authService = new AuthService(); 