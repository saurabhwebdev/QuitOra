import { Habit } from '../types/habit';

export const calculateHabitStats = (habits: Habit[]) => {
  const totalHabits = habits.length;
  const totalDaysStreak = habits.reduce((acc, habit) => acc + habit.currentStreak, 0);
  const completedHabits = habits.filter(habit => habit.currentStreak >= habit.targetDays).length;
  const longestStreak = Math.max(...habits.map(habit => habit.longestStreak), 0);
  
  const categoryDistribution = habits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const streakDistribution = habits.reduce((acc, habit) => {
    const streakRange = Math.floor(habit.currentStreak / 7) * 7;
    acc[`${streakRange}-${streakRange + 6} days`] = (acc[`${streakRange}-${streakRange + 6} days`] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalHabits,
    totalDaysStreak,
    completedHabits,
    longestStreak,
    categoryDistribution,
    streakDistribution
  };
}; 