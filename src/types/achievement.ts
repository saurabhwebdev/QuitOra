export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (stats: { 
    totalHabits: number; 
    totalDaysStreak: number; 
    completedHabits: number; 
    longestStreak: number;
    categoryDistribution: Record<string, number>;
  }) => boolean;
}

export const achievements: Achievement[] = [
  // Getting Started
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Started your journey by creating your first habit',
    icon: '🌱',
    rarity: 'common',
    condition: (stats) => stats.totalHabits >= 1
  },
  {
    id: 'habit_collector',
    title: 'Habit Collector',
    description: 'Track 5 different habits simultaneously',
    icon: '📝',
    rarity: 'rare',
    condition: (stats) => stats.totalHabits >= 5
  },

  // Streak Based
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '🗓️',
    rarity: 'common',
    condition: (stats) => stats.longestStreak >= 7
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Achieved a 30-day streak',
    icon: '🔥',
    rarity: 'rare',
    condition: (stats) => stats.longestStreak >= 30
  },
  {
    id: 'habit_legend',
    title: 'Habit Legend',
    description: 'Incredible! 100-day streak achieved',
    icon: '⭐',
    rarity: 'epic',
    condition: (stats) => stats.longestStreak >= 100
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Legendary 365-day streak!',
    icon: '👑',
    rarity: 'legendary',
    condition: (stats) => stats.longestStreak >= 365
  },

  // Completion Based
  {
    id: 'first_victory',
    title: 'First Victory',
    description: 'Successfully completed your first habit goal',
    icon: '🏆',
    rarity: 'common',
    condition: (stats) => stats.completedHabits >= 1
  },
  {
    id: 'transformation',
    title: 'Transformation',
    description: 'Completed 3 different habits',
    icon: '🦋',
    rarity: 'rare',
    condition: (stats) => stats.completedHabits >= 3
  },
  {
    id: 'habit_master',
    title: 'Habit Master',
    description: 'Completed 10 different habits',
    icon: '🎯',
    rarity: 'epic',
    condition: (stats) => stats.completedHabits >= 10
  },

  // Category Based
  {
    id: 'digital_detox',
    title: 'Digital Detox',
    description: 'Complete a Social Media habit',
    icon: '📱',
    rarity: 'common',
    condition: (stats) => stats.categoryDistribution['Social Media'] >= 1
  },
  {
    id: 'health_conscious',
    title: 'Health Conscious',
    description: 'Complete a Junk Food habit',
    icon: '🥗',
    rarity: 'common',
    condition: (stats) => stats.categoryDistribution['Junk Food'] >= 1
  },
  {
    id: 'clear_mind',
    title: 'Clear Mind',
    description: 'Complete a Smoking habit',
    icon: '🌬️',
    rarity: 'rare',
    condition: (stats) => stats.categoryDistribution['Smoking'] >= 1
  },

  // Milestone Based
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Accumulated 50 total streak days',
    icon: '🌅',
    rarity: 'common',
    condition: (stats) => stats.totalDaysStreak >= 50
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Accumulated 100 total streak days',
    icon: '💯',
    rarity: 'rare',
    condition: (stats) => stats.totalDaysStreak >= 100
  },
  {
    id: 'marathon_runner',
    title: 'Marathon Runner',
    description: 'Accumulated 365 total streak days',
    icon: '🏃',
    rarity: 'epic',
    condition: (stats) => stats.totalDaysStreak >= 365
  },
  {
    id: 'lifestyle_changer',
    title: 'Lifestyle Changer',
    description: 'Accumulated 1000 total streak days',
    icon: '🌟',
    rarity: 'legendary',
    condition: (stats) => stats.totalDaysStreak >= 1000
  },

  // Special Achievements
  {
    id: 'variety_master',
    title: 'Variety Master',
    description: 'Complete habits from 5 different categories',
    icon: '🎨',
    rarity: 'epic',
    condition: (stats) => Object.keys(stats.categoryDistribution).length >= 5
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 5 habits without breaking a streak',
    icon: '💎',
    rarity: 'legendary',
    condition: (stats) => stats.completedHabits >= 5 && stats.longestStreak >= stats.totalDaysStreak
  }
];

// Helper function to get achievement rarity color
export const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'text-gray-600 bg-gray-100';
    case 'rare':
      return 'text-blue-600 bg-blue-100';
    case 'epic':
      return 'text-purple-600 bg-purple-100';
    case 'legendary':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Helper function to get rarity label
export const getRarityLabel = (rarity: Achievement['rarity']) => {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}; 