import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Habit } from '../types/habit';
import { Award, Calendar, Target, ChartBar, Trophy, Star, Lock, CheckCircle } from 'lucide-react';
import { achievements, getRarityColor, getRarityLabel, Achievement } from '../types/achievement';
import { calculateHabitStats } from '../utils/statistics';
import { motion } from 'framer-motion';
import { containerVariants, fadeIn, scaleIn } from '../utils/animations';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

const Profile = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'achievements' | 'statistics'>('achievements');

  useEffect(() => {
    const fetchHabits = async () => {
      if (!currentUser) return;

      try {
        const habitsRef = collection(db, 'habits');
        const q = query(habitsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const habitsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate.toDate(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
          lastCheckin: doc.data().lastCheckin?.toDate() || null
        })) as Habit[];

        setHabits(habitsData);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [currentUser]);

  const stats = calculateHabitStats(habits);
  const unlockedAchievements = achievements.filter(achievement => 
    achievement.condition(stats)
  );

  const AchievementCard = ({ achievement, unlocked }: { achievement: Achievement, unlocked: boolean }) => {
    const rarityColors = getRarityColor(achievement.rarity);
    
    return (
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: unlocked ? 1.05 : 1 }}
        className={`p-4 rounded-xl text-center relative ${
          unlocked 
            ? `bg-white border-2 border-${rarityColors.split(' ')[0]}`
            : 'bg-gray-50 border-2 border-gray-200'
        }`}
      >
        {!unlocked && (
          <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[1px] rounded-xl 
                        flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 px-3 py-1 rounded-full text-sm text-gray-600 flex items-center gap-1">
              <Lock size={14} />
              Keep going!
            </div>
          </div>
        )}
        <div className={`text-4xl mb-2 ${!unlocked && 'grayscale'}`}>{achievement.icon}</div>
        <h3 className={`font-semibold mb-1 ${unlocked ? 'text-gray-800' : 'text-gray-600'}`}>
          {achievement.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {achievement.description}
        </p>
        <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${rarityColors}`}>
          <Star size={12} />
          {getRarityLabel(achievement.rarity)}
        </div>
        {unlocked && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle size={12} />
            Achieved
          </div>
        )}
      </motion.div>
    );
  };

  const renderAchievements = () => {
    const achieved = achievements.filter(achievement => achievement.condition(stats));
    const locked = achievements.filter(achievement => !achievement.condition(stats));

    const rarityOrder: Achievement['rarity'][] = ['legendary', 'epic', 'rare', 'common'];
    
    return (
      <div className="space-y-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievement Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(achieved.length / achievements.length) * 100}%` }}
                  className="h-full bg-indigo-600"
                />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600">
              {achieved.length}/{achievements.length}
            </div>
          </div>
        </div>

        {/* Achievements by Rarity */}
        {rarityOrder.map(rarity => {
          const rarityAchievements = achievements.filter(a => a.rarity === rarity);
          if (rarityAchievements.length === 0) return null;

          return (
            <div key={rarity}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Star className={getRarityColor(rarity).split(' ')[0]} size={20} />
                {getRarityLabel(rarity)} Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rarityAchievements.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={achieved.includes(achievement)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-indigo-600">
            {payload[0].value} {payload[0].value === 1 ? 'habit' : 'habits'}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderStatistics = () => {
    // Transform data for charts
    const categoryData = Object.entries(stats.categoryDistribution).map(([name, value]) => ({
      name,
      value
    }));

    const completionData = habits.map(habit => ({
      name: habit.name.length > 15 ? habit.name.substring(0, 15) + '...' : habit.name,
      streak: habit.currentStreak
    })).sort((a, b) => b.streak - a.streak).slice(0, 5);

    const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#10B981', '#F59E0B'];

    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={fadeIn} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Active Habits</div>
            <div className="text-2xl font-bold text-indigo-600">{stats.totalHabits}</div>
          </motion.div>
          <motion.div variants={fadeIn} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Total Days</div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalDaysStreak}</div>
          </motion.div>
          <motion.div variants={fadeIn} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completedHabits}</div>
          </motion.div>
          <motion.div variants={fadeIn} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-amber-600">
              {stats.totalHabits ? Math.round((stats.completedHabits / stats.totalHabits) * 100) : 0}%
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-800 mb-4">Habits by Category</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Habits */}
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-800 mb-4">Top Performing Habits</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} layout="vertical" barSize={20}>
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    content={({ payload }) => 
                      payload?.[0] ? (
                        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-100 text-xs">
                          <div className="font-medium">{payload[0].payload.name}</div>
                          <div className="text-indigo-600">{payload[0].value} day streak</div>
                        </div>
                      ) : null
                    }
                  />
                  <Bar 
                    dataKey="streak" 
                    fill="#4F46E5"
                    radius={[0, 4, 4, 0]}
                  >
                    {completionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={`rgba(79, 70, 229, ${1 - (index * 0.15)})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Streak Timeline */}
        <motion.div variants={fadeIn} className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-800 mb-4">Streak Timeline</h3>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="streak"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <motion.div 
        variants={fadeIn}
        className="bg-white rounded-2xl shadow-sm p-8 mb-8"
      >
        <div className="flex items-center space-x-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center"
          >
            <span className="text-3xl text-indigo-600">
              {currentUser?.email?.[0].toUpperCase()}
            </span>
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentUser?.email}
            </h2>
            <p className="text-gray-500">
              Member since {new Date(currentUser?.metadata.creationTime || '').toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={scaleIn} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Habits</h3>
            <Target className="text-indigo-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalHabits}</p>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Days Streak</h3>
            <Calendar className="text-indigo-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalDaysStreak}</p>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
            <Trophy className="text-indigo-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats.completedHabits}</p>
        </motion.div>
      </motion.div>

      <div className="mt-8 bg-gray-50 rounded-2xl p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'statistics'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Statistics
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'achievements' ? renderAchievements() : renderStatistics()}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile; 