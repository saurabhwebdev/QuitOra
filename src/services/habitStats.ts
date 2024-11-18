import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface HabitStats {
  dailyStreak: number;
  completionRate: number;
  totalHabits: number;
  monthlyProgress: number;
  weeklyActivity: { name: string; value: number }[];
  monthlyTrends: { name: string; completed: number; total: number }[];
  habitDistribution: { name: string; value: number }[];
}

export const habitStatsService = {
  async getStats(userId: string): Promise<HabitStats> {
    try {
      // Get all habits for the user
      const habitsQuery = query(
        collection(db, 'habits'),
        where('userId', '==', userId)
      );
      const habitsSnapshot = await getDocs(habitsQuery);
      const habits = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get all check-ins for the user
      const checkInsQuery = query(
        collection(db, 'checkIns'),
        where('userId', '==', userId)
      );
      const checkInsSnapshot = await getDocs(checkInsQuery);
      const checkIns = checkInsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate daily streak
      const dailyStreak = this.calculateDailyStreak(checkIns);

      // Calculate completion rate
      const completionRate = this.calculateCompletionRate(checkIns);

      // Get total habits count
      const totalHabits = habits.length;

      // Calculate monthly progress
      const monthlyProgress = this.calculateMonthlyProgress(checkIns);

      // Get weekly activity data
      const weeklyActivity = this.getWeeklyActivity(checkIns);

      // Get monthly trends
      const monthlyTrends = this.getMonthlyTrends(checkIns);

      // Get habit distribution
      const habitDistribution = this.getHabitDistribution(habits);

      return {
        dailyStreak,
        completionRate,
        totalHabits,
        monthlyProgress,
        weeklyActivity,
        monthlyTrends,
        habitDistribution
      };
    } catch (error) {
      console.error('Error fetching habit stats:', error);
      throw error;
    }
  },

  calculateDailyStreak(checkIns: any[]): number {
    if (!checkIns.length) return 0;

    const sortedCheckIns = checkIns
      .map(ci => ci.timestamp.toDate())
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 1;
    let currentDate = sortedCheckIns[0];

    for (let i = 1; i < sortedCheckIns.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      if (sortedCheckIns[i].toDateString() === prevDate.toDateString()) {
        streak++;
        currentDate = sortedCheckIns[i];
      } else {
        break;
      }
    }

    return streak;
  },

  calculateCompletionRate(checkIns: any[]): number {
    if (!checkIns.length) return 0;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentCheckIns = checkIns.filter(ci => 
      ci.timestamp.toDate() >= last30Days
    );

    return Math.round((recentCheckIns.length / 30) * 100);
  },

  calculateMonthlyProgress(checkIns: any[]): number {
    const currentMonth = new Date().getMonth();
    const monthCheckIns = checkIns.filter(ci => 
      ci.timestamp.toDate().getMonth() === currentMonth
    );

    const daysInMonth = new Date(
      new Date().getFullYear(),
      currentMonth + 1,
      0
    ).getDate();

    return Math.round((monthCheckIns.length / daysInMonth) * 100);
  },

  getWeeklyActivity(checkIns: any[]): { name: string; value: number }[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = Array(7).fill(0);
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    checkIns.forEach(ci => {
      const date = ci.timestamp.toDate();
      if (date >= lastWeek && date <= today) {
        weeklyData[date.getDay()]++;
      }
    });

    return days.map((day, index) => ({
      name: day,
      value: weeklyData[index]
    }));
  },

  getMonthlyTrends(checkIns: any[]): { name: string; completed: number; total: number }[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = Array(12).fill({ completed: 0, total: 30 });

    checkIns.forEach(ci => {
      const month = ci.timestamp.toDate().getMonth();
      monthlyData[month].completed++;
    });

    return months.map((month, index) => ({
      name: month,
      ...monthlyData[index]
    }));
  },

  getHabitDistribution(habits: any[]): { name: string; value: number }[] {
    const categories = habits.reduce((acc: Record<string, number>, habit: any) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  }
}; 