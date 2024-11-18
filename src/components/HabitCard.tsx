import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Habit } from '../types/habit';
import { Calendar, Trophy, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
  onDelete?: (id: string) => void;
}

const HabitCard = ({ habit, onUpdate, onDelete }: HabitCardProps) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleCheckIn = async () => {
    if (loading || habit.lastCheckin?.toDateString() === new Date().toDateString()) {
      return;
    }

    setLoading(true);
    const habitRef = doc(db, 'habits', habit.id);
    const now = new Date();
    const lastCheckIn = habit.lastCheckin ? new Date(habit.lastCheckin) : null;
    
    try {
      const isStreak = lastCheckIn && 
        (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24) <= 1;
      
      const newStreak = isStreak ? habit.currentStreak + 1 : 1;
      const newLongestStreak = Math.max(newStreak, habit.longestStreak);

      await updateDoc(habitRef, {
        lastCheckin: now,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        updatedAt: now
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(habit.id);
      setShowConfirmDelete(false);
    }
  };

  const progress = (habit.currentStreak / habit.targetDays) * 100;

  const isStartDateInFuture = habit.startDate > new Date();
  const formattedStartDate = habit.startDate.toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{habit.name}</h3>
            <p className="text-gray-500 text-sm">{habit.description}</p>
          </div>
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowConfirmDelete(true)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </motion.button>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className={isStartDateInFuture ? "text-orange-500" : "text-indigo-500"} />
            <span>
              {isStartDateInFuture 
                ? `To be started on ${formattedStartDate}`
                : `Started ${formattedStartDate}`
              }
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trophy size={16} className="text-indigo-500" />
            <span>Longest streak: {habit.longestStreak} days</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-indigo-500" />
            <span>{habit.targetDays - habit.currentStreak} days remaining</span>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-xs font-semibold inline-block text-indigo-600">
                Progress
              </div>
              <div className="text-xs font-semibold inline-block text-indigo-600">
                {Math.round(progress)}%
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-indigo-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckIn}
          disabled={loading || habit.lastCheckin?.toDateString() === new Date().toDateString() || isStartDateInFuture}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg transition duration-200
            ${loading || habit.lastCheckin?.toDateString() === new Date().toDateString() || isStartDateInFuture
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          <CheckCircle size={20} />
          {loading ? 'Updating...' : isStartDateInFuture ? 'Not Started Yet' : 'Check In'}
        </motion.button>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm mx-4"
          >
            <h3 className="text-lg font-semibold mb-2">Delete Habit</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this habit? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HabitCard; 