import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { fadeIn } from '../utils/animations';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
      setEmail(''); // Clear the form
    } catch (err) {
      toast.error('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="min-h-[80vh] flex items-center justify-center px-4"
    >
      <motion.div 
        variants={fadeIn}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>
          
          <motion.button
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 
                     transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </motion.button>
        </form>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center space-y-4"
        >
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link 
              to="/login" 
              className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
          <p className="text-gray-600">
            <Link 
              to="/" 
              className="text-gray-500 hover:text-indigo-600 text-sm transition-colors"
            >
              ← Back to Homepage
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword; 