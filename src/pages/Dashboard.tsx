import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Habit } from '../types/habit';
import HabitCard from '../components/HabitCard';
import { motion } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { containerVariants, fadeIn } from '../utils/animations';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchHabits = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const habitsRef = collection(db, 'habits');
      const q = query(
        habitsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

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
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleHabitUpdate = () => {
    fetchHabits();
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteDoc(doc(db, 'habits', habitId));
      toast.success('Habit deleted successfully');
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
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
      className="max-w-6xl mx-auto px-4 py-8 mt-8"
    >
      <div className="flex justify-between items-center mb-12">
        <motion.h1 
          variants={fadeIn}
          className="text-3xl font-bold text-gray-800"
        >
          Your Habits
        </motion.h1>
        <motion.div variants={fadeIn}>
          <Link
            to="/add-habit"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg
                     hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            <span>Add Habit</span>
          </Link>
        </motion.div>
      </div>

      {habits.length === 0 ? (
        <motion.div 
          variants={fadeIn}
          className="text-center py-16 bg-white rounded-2xl shadow-sm"
        >
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl text-gray-600 mb-4">No habits tracked yet</h3>
          <p className="text-gray-500 mb-8">
            Start your journey by adding a habit you want to quit
          </p>
          <Link
            to="/add-habit"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg
                     hover:bg-indigo-700 transition-colors duration-200"
          >
            <Plus size={20} />
            <span>Add Your First Habit</span>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              variants={fadeIn}
              custom={index}
              transition={{ delay: index * 0.1 }}
            >
              <HabitCard 
                habit={habit} 
                onUpdate={handleHabitUpdate}
                onDelete={handleDeleteHabit}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard; 