import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: 'student' | 'tutor';
  avatar: string | null;
  status: string;
  aboutMe: string;
  expertise?: string[];
  rating?: number;
  hourlyRate?: number;
  subjects?: string[];
  xp: number;
  targetXp: number;
  streakDays: number;
  joinedDate: string;
}

class UserService {
  private baseUrl = 'http://localhost:3001';
  private currentUser: User | null = null;

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/users/current`);
      this.currentUser = response.data;
      return this.currentUser;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  async updateUser(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await axios.patch(`${this.baseUrl}/users/${this.currentUser?.id}`, userData);
      this.currentUser = response.data;
      return this.currentUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async getTutors(filters?: { subject?: string; maxRate?: number }): Promise<User[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/users`, {
        params: { role: 'tutor', ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tutors:', error);
      return [];
    }
  }

  async updateAvatar(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await axios.post(`${this.baseUrl}/users/${this.currentUser?.id}/avatar`, formData);
      if (this.currentUser) {
        this.currentUser.avatar = response.data.avatarUrl;
      }
      return response.data.avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  }
}

export const userService = new UserService(); 