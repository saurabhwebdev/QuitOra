import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, Settings, Shield, Bell, Mail, 
  LogOut, ChevronRight, Calendar, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fadeIn, containerVariants } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { PersonalInfoModal } from '../components/profile/PersonalInfoModal';
import { EmailSettingsModal } from '../components/profile/EmailSettingsModal';
import { NotificationsModal } from '../components/profile/NotificationsModal';
import { ActivityLogModal } from '../components/profile/ActivityLogModal';
import { AppSettingsModal } from '../components/profile/AppSettingsModal';
import { useTranslation } from 'react-i18next';

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

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="max-w-4xl mx-auto px-4 py-8"
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