import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { FeedbackType as FeedbackData } from '../types/feedback';
import { MessageSquare, ThumbsUp, Plus, Bug, Lightbulb, ArrowUp, Filter } from 'lucide-react';
import { fadeIn, containerVariants } from '../utils/animations';
import toast from 'react-hot-toast';

type FeedbackCategory = 'feature' | 'bug' | 'improvement';

const FEEDBACK_TYPES = [
  { id: 'feature' as FeedbackCategory, label: 'Feature Request', icon: Lightbulb, color: 'text-purple-600 bg-purple-100' },
  { id: 'bug' as FeedbackCategory, label: 'Bug Report', icon: Bug, color: 'text-red-600 bg-red-100' },
  { id: 'improvement' as FeedbackCategory, label: 'Improvement', icon: ArrowUp, color: 'text-indigo-600 bg-indigo-100' }
] as const;

const STATUS_COLORS = {
  'pending': 'bg-gray-100 text-gray-600',
  'under-review': 'bg-blue-100 text-blue-600',
  'planned': 'bg-purple-100 text-purple-600',
  'in-progress': 'bg-yellow-100 text-yellow-600',
  'completed': 'bg-green-100 text-green-600',
  'declined': 'bg-red-100 text-red-600'
};

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewFeedbackForm, setShowNewFeedbackForm] = useState(false);
  const [filter, setFilter] = useState<'all' | FeedbackCategory>('all');
  const [sort, setSort] = useState<'votes' | 'recent'>('votes');
  const { currentUser } = useAuth();

  const [newFeedback, setNewFeedback] = useState({
    title: '',
    description: '',
    type: FEEDBACK_TYPES[0].id
  });

  useEffect(() => {
    fetchFeedbacks();
  }, [sort]);

  const fetchFeedbacks = async () => {
    try {
      const feedbackRef = collection(db, 'feedbacks');
      const q = query(feedbackRef, orderBy(sort === 'votes' ? 'votes' : 'createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const feedbackData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as FeedbackData[];

      setFeedbacks(feedbackData);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const feedbackData = {
        ...newFeedback,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'pending',
        votes: [currentUser.uid],
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: []
      };

      await addDoc(collection(db, 'feedbacks'), feedbackData);
      toast.success('Feedback submitted successfully!');
      setShowNewFeedbackForm(false);
      setNewFeedback({ title: '', description: '', type: FEEDBACK_TYPES[0].id });
      fetchFeedbacks();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const handleVote = async (feedback: FeedbackData) => {
    if (!currentUser) return;

    try {
      const hasVoted = feedback.votes.includes(currentUser.uid);
      const newVotes = hasVoted
        ? feedback.votes.filter((id: string) => id !== currentUser.uid)
        : [...feedback.votes, currentUser.uid];

      await updateDoc(doc(db, 'feedbacks', feedback.id), {
        votes: newVotes,
        updatedAt: new Date()
      });

      toast.success(hasVoted ? 'Vote removed' : 'Vote added');
      fetchFeedbacks();
    } catch (error) {
      console.error('Error updating vote:', error);
      toast.error('Failed to update vote');
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => 
    filter === 'all' ? true : feedback.type === filter
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="max-w-5xl mx-auto px-4 py-12"
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.h1 
          variants={fadeIn} 
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Community Feedback
        </motion.h1>
        <motion.p 
          variants={fadeIn} 
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
        >
          Help shape the future of QuitOra by sharing your ideas and suggestions
        </motion.p>
        <motion.button
          variants={fadeIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewFeedbackForm(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                   text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus size={20} />
          <span>Share Feedback</span>
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div 
        variants={fadeIn}
        className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 text-gray-600">
          <Filter size={20} />
          <span className="font-medium">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {FEEDBACK_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === type.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <type.icon size={16} />
              {type.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Feedback List */}
      <motion.div 
        variants={containerVariants}
        className="grid gap-6"
      >
        {filteredFeedbacks.map((feedback, index) => (
          <motion.div
            key={feedback.id}
            variants={fadeIn}
            custom={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                     hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-xl ${FEEDBACK_TYPES.find(t => t.id === feedback.type)?.color}`}>
                  {(() => {
                    const TypeIcon = FEEDBACK_TYPES.find(t => t.id === feedback.type)?.icon;
                    return TypeIcon ? <TypeIcon size={24} /> : null;
                  })()}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${FEEDBACK_TYPES.find(t => t.id === feedback.type)?.color}`}>
                    {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[feedback.status]}`}>
                    {feedback.status.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feedback.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feedback.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {feedback.userEmail.charAt(0).toUpperCase()}
                    </div>
                    <span>{feedback.userEmail}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2 text-indigo-600">
                      <MessageSquare size={16} />
                      <span>{feedback.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* New Feedback Modal - Enhanced */}
      {showNewFeedbackForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {FEEDBACK_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setNewFeedback({ ...newFeedback, type: type.id })}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200
                          ${newFeedback.type === type.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-200 hover:border-indigo-600'
                          }`}
                      >
                        <type.icon size={20} />
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={newFeedback.title}
                      onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Brief description of your feedback"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      value={newFeedback.description}
                      onChange={(e) => setNewFeedback({ ...newFeedback, description: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                      placeholder="Detailed explanation of your feedback"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewFeedbackForm(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                           rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeedbackPage; 