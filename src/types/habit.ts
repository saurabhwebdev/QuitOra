export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  startDate: Date;
  targetDays: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckin: Date | null;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export type HabitFormData = Omit<Habit, 'id' | 'userId' | 'currentStreak' | 'longestStreak' | 'lastCheckin' | 'createdAt' | 'updatedAt'>; 