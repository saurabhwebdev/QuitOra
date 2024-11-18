import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, Settings, Shield, Bell, Mail, 
  LogOut, ChevronRight, Calendar, Activity,
  TrendingUp, PieChart, BarChart2, Clock
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartPieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer, Area
} from 'recharts';
import toast from 'react-hot-toast';
import { fadeIn, containerVariants } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { PersonalInfoModal } from '../components/profile/PersonalInfoModal';
import { EmailSettingsModal } from '../components/profile/EmailSettingsModal';
import { NotificationsModal } from '../components/profile/NotificationsModal';
import { ActivityLogModal } from '../components/profile/ActivityLogModal';
import { AppSettingsModal } from '../components/profile/AppSettingsModal';
import { useTranslation } from 'react-i18next';
import { habitStatsService } from '../services/habitStats';

interface StatsState {
  dailyStreak: number;
  completionRate: number;
  totalHabits: number;
  monthlyProgress: number;
  weeklyActivity: { name: string; value: number }[];
  monthlyTrends: { name: string; completed: number; total: number }[];
  habitDistribution: { name: string; value: number }[];
}

const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const { t } = useTranslation();
  return (
    <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t(title)}</h3>
      {children}
    </motion.div>
  );
};

interface MenuItemProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
}

const MenuItem = ({ icon: Icon, title, subtitle, onClick, disabled = false }: MenuItemProps) => {
  const { t } = useTranslation();
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-4 rounded-xl 
                hover:bg-gray-50 transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-gray-900">{t(title)}</h4>
          <p className="text-sm text-gray-500">{t(subtitle)}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </motion.button>
  );
};

const StatCard = ({ icon: Icon, title, value, trend }: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <h4 className="text-gray-500 text-sm">{t(title)}</h4>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [stats, setStats] = useState<StatsState>({
    dailyStreak: 0,
    completionRate: 0,
    totalHabits: 0,
    monthlyProgress: 0,
    weeklyActivity: [],
    monthlyTrends: [],
    habitDistribution: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser) return;
      
      try {
        setStatsLoading(true);
        const userStats = await habitStatsService.getStats(currentUser.uid);
        setStats(userStats);
      } catch (error) {
        toast.error('Failed to load statistics');
        console.error('Error loading stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/');
      toast.success(t('profile.logout.success'));
    } catch {
      toast.error(t('profile.logout.error'));
    } finally {
      setLoading(false);
    }
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

  const COLORS = ['#4F46E5', '#7C3AED', '#2563EB', '#9333EA'];

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Profile Header */}
      <motion.div variants={fadeIn} className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
          >
            <span className="text-4xl font-bold">
              {currentUser?.email?.[0].toUpperCase()}
            </span>
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {currentUser?.email}
            </h2>
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {t('profile.joined')} {new Date(currentUser?.metadata.creationTime || '').toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Important Stats */}
      <ProfileSection title="profile.stats.title">
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={TrendingUp}
              title="profile.stats.dailyStreak"
              value={`${stats.dailyStreak} days`}
              trend={{ value: stats.dailyStreak, isPositive: true }}
            />
            <StatCard
              icon={PieChart}
              title="profile.stats.completionRate"
              value={`${stats.completionRate}%`}
              trend={{ value: stats.completionRate - 100, isPositive: stats.completionRate >= 100 }}
            />
            <StatCard
              icon={BarChart2}
              title="profile.stats.totalHabits"
              value={stats.totalHabits}
              trend={{ value: stats.totalHabits, isPositive: true }}
            />
            <StatCard
              icon={Clock}
              title="profile.stats.monthlyProgress"
              value={`${stats.monthlyProgress}%`}
              trend={{ value: stats.monthlyProgress - 100, isPositive: stats.monthlyProgress >= 100 }}
            />
          </div>
        )}
      </ProfileSection>

      {/* Charts and Analytics */}
      <ProfileSection title="profile.charts.title">
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weekly Activity Chart */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">{t('profile.charts.weeklyActivity')}</h4>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  Last 7 days
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stats.weeklyActivity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#colorActivity)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">{t('profile.charts.monthlyTrends')}</h4>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  This year
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={stats.monthlyTrends} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#4F46E5"
                    fillOpacity={1}
                    fill="url(#colorTrend)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Habit Distribution */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">{t('profile.charts.habitDistribution')}</h4>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  All habits
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <RechartPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={stats.habitDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.habitDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </RechartPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </ProfileSection>

      {/* Account Settings */}
      <ProfileSection title="profile.accountSettings.title">
        <div className="space-y-2 divide-y divide-gray-100">
          <MenuItem 
            icon={User}
            title="profile.personalInfo.title"
            subtitle="profile.personalInfo.subtitle"
            onClick={() => setShowPersonalInfo(true)}
          />
          <MenuItem 
            icon={Mail}
            title="profile.emailSettings.title"
            subtitle="profile.emailSettings.subtitle"
            onClick={() => setShowEmailSettings(true)}
          />
          <MenuItem 
            icon={Shield}
            title="profile.passwordSecurity.title"
            subtitle="profile.passwordSecurity.subtitle"
            onClick={() => navigate('/forgot-password')}
          />
        </div>
      </ProfileSection>

      {/* Preferences */}
      <ProfileSection title="profile.preferences.title">
        <div className="space-y-2 divide-y divide-gray-100">
          <MenuItem 
            icon={Bell}
            title="profile.notifications.title"
            subtitle="profile.notifications.subtitle"
            onClick={() => setShowNotifications(true)}
          />
          <MenuItem 
            icon={Activity}
            title="profile.activityLog.title"
            subtitle="profile.activityLog.subtitle"
            onClick={() => setShowActivityLog(true)}
          />
          <MenuItem 
            icon={Settings}
            title="profile.appSettings.title"
            subtitle="profile.appSettings.subtitle"
            onClick={() => setShowAppSettings(true)}
          />
        </div>
      </ProfileSection>

      {/* Logout Section */}
      <motion.div variants={fadeIn} className="mt-8">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
                   bg-red-50 text-red-600 rounded-xl hover:bg-red-100 
                   transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('profile.logout.title')}</span>
        </button>
      </motion.div>

      {/* Modals */}
      <PersonalInfoModal 
        isOpen={showPersonalInfo} 
        onClose={() => setShowPersonalInfo(false)} 
      />
      <EmailSettingsModal 
        isOpen={showEmailSettings} 
        onClose={() => setShowEmailSettings(false)} 
      />
      <NotificationsModal 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <ActivityLogModal 
        isOpen={showActivityLog} 
        onClose={() => setShowActivityLog(false)} 
      />
      <AppSettingsModal 
        isOpen={showAppSettings} 
        onClose={() => setShowAppSettings(false)} 
      />
    </motion.div>
  );
};

export default Profile; 