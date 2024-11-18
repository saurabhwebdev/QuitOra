import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { HabitFormData } from '../types/habit';
import { motion } from 'framer-motion';
import { Calendar, Target, Tag, FileText, ArrowLeft, Cigarette, Monitor, Pizza, Clock, ShoppingBag, Coffee, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { fadeIn, containerVariants } from '../utils/animations';
import { useTranslation } from 'react-i18next';

const PRESET_DAYS = [7, 14, 30, 60, 90];

const CATEGORIES = [
  { id: 'smoking', label: 'Smoking', icon: Cigarette },
  { id: 'social-media', label: 'Social Media', icon: Monitor },
  { id: 'junk-food', label: 'Junk Food', icon: Pizza },
  { id: 'procrastination', label: 'Procrastination', icon: Clock },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'caffeine', label: 'Caffeine', icon: Coffee },
  { id: 'other', label: 'Other', icon: MoreHorizontal }
];

const AddHabit = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    startDate: new Date(),
    targetDays: 30,
    category: CATEGORIES[0].id,
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const loadingToast = toast.loading('Creating your habit...');
    
    try {
      setLoading(true);
      await addDoc(collection(db, 'habits'), {
        ...formData,
        userId: currentUser.uid,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success('Habit created successfully!', { id: loadingToast });
      navigate('/');
    } catch (err) {
      toast.error('Failed to create habit', { id: loadingToast });
      console.error('Error adding habit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-[calc(100vh-4rem)] flex flex-col px-4 py-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeIn} className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={t('addHabit.backButton')}
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{t('addHabit.title')}</h1>
      </motion.div>

      <motion.form 
        variants={containerVariants}
        onSubmit={handleSubmit} 
        className="flex-1 grid md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm"
      >
        {/* Left Column */}
        <div className="space-y-6">
          <motion.div variants={fadeIn}>
            <label className="block text-gray-700 mb-4 flex items-center gap-2">
              <Tag size={18} className="text-indigo-600" />
              <span className="font-medium">{t('addHabit.habitName.label')}</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder={t('addHabit.habitName.placeholder')}
              required
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <label className="block text-gray-700 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              <span className="font-medium">{t('addHabit.motivation.label')}</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
              style={{ height: 'calc(100% - 4rem)' }}
              placeholder={t('addHabit.motivation.placeholder')}
              required
            />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <motion.div variants={fadeIn}>
            <label className="block text-gray-700 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              <span className="font-medium">{t('addHabit.startDate.label')}</span>
            </label>
            <input
              type="date"
              value={formData.startDate.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <label className="block text-gray-700 mb-4 flex items-center gap-2">
              <Target size={18} className="text-indigo-600" />
              <span className="font-medium">{t('addHabit.targetDays.label')}</span>
            </label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {PRESET_DAYS.map(days => (
                <motion.button
                  key={days}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, targetDays: days })}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    formData.targetDays === days
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {days} {t('addHabit.targetDays.days')}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="90"
                value={formData.targetDays}
                onChange={(e) => setFormData({ ...formData, targetDays: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="w-16 text-center font-medium text-gray-700">{formData.targetDays} days</span>
            </div>
          </motion.div>

          <motion.div variants={fadeIn}>
            <label className="block text-gray-700 mb-4 font-medium">
              {t('addHabit.categories.label')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, category: id })}
                  className={`p-3 rounded-xl text-sm transition-all flex flex-col items-center gap-2 ${
                    formData.category === id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="!mt-auto pt-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 
                       transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 font-medium shadow-md"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Creating...
                </>
              ) : (
                'Create Habit'
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default AddHabit; 