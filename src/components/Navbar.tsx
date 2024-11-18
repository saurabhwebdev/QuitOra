import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, User, Home, Menu, X, Coffee, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { slideIn } from '../utils/animations';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) return null;

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
        ${location.pathname === to 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'}`}
    >
      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="font-bold text-xl text-indigo-600 flex items-center gap-2"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-indigo-600 rounded-lg text-white flex items-center justify-center"
            >
              Q
            </motion.div>
            QuitOra
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" icon={Home} label="Dashboard" />
            <NavLink to="/add-habit" icon={Plus} label="Add Habit" />
            <NavLink to="/profile" icon={User} label="Profile" />
            <NavLink to="/donation" icon={Coffee} label="Support Us" />
            <NavLink to="/feedback" icon={MessageSquare} label="Feedback" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={slideIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-4"
          >
            <div className="flex flex-col space-y-2">
              <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link to="/add-habit" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                <Plus className="w-5 h-5" />
                <span>Add Habit</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link to="/donation" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                <Coffee className="w-5 h-5" />
                <span>Support Us</span>
              </Link>
              <Link to="/feedback" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                <MessageSquare className="w-5 h-5" />
                <span>Feedback</span>
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar; 