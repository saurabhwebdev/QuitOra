import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Mail, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { userPreferencesService, defaultPreferences, usePreferencesStore } from '../../services/userPreferences';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal = ({ isOpen, onClose }: Props) => {
  const { currentUser } = useAuth();
  const { preferences, loading } = usePreferencesStore();

  const handleToggle = async (id: keyof typeof preferences.notifications) => {
    if (!currentUser) return;
    
    try {
      const newSettings = {
        ...preferences.notifications,
        [id]: !preferences.notifications[id]
      };
      
      await userPreferencesService.updateNotifications(currentUser.uid, newSettings);
      toast.success('Notification preference updated');
    } catch (error) {
      toast.error('Failed to update notification preference');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Notification Settings</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {Object.keys(preferences.notifications).map(setting => (
            <div key={setting} className="flex items-start space-x-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                {setting === 'push' && <Smartphone className="w-5 h-5 text-indigo-600" />}
                {setting === 'email' && <Mail className="w-5 h-5 text-indigo-600" />}
                {setting === 'reminders' && <Bell className="w-5 h-5 text-indigo-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{setting.charAt(0).toUpperCase() + setting.slice(1)}</h4>
                  <button
                    onClick={() => handleToggle(setting as keyof typeof preferences.notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                              ${preferences.notifications[setting as keyof typeof preferences.notifications] ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${preferences.notifications[setting as keyof typeof preferences.notifications] ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{setting.charAt(0).toUpperCase() + setting.slice(1)} Notifications</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 