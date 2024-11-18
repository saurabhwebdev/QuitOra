import { motion, useAnimation } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Shield, Zap, Heart, Gift, Coffee } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleDonationClick = () => {
    if (!currentUser) {
      toast.error('Please sign in to support us!');
      navigate('/login', { state: { from: '/donation' } });
      return;
    }
    navigate('/donation');
  };

  const features = [
    {
      icon: <Star className="text-yellow-500" />,
      title: "Track Your Progress",
      description: "Monitor your journey with detailed statistics and achievements"
    },
    {
      icon: <Shield className="text-indigo-500" />,
      title: "Stay Accountable",
      description: "Daily check-ins and streak tracking to keep you motivated"
    },
    {
      icon: <Zap className="text-orange-500" />,
      title: "Build Better Habits",
      description: "Transform your life one habit at a time"
    }
  ];

  // SVG Animation variants
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  // Animated background SVG
  const WaveBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <motion.svg
        className="absolute w-full h-full"
        viewBox="0 0 1440 320"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <motion.path
          fill="#4F46E5"
          fillOpacity="0.1"
          initial={{ d: "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,74.7C960,53,1056,75,1152,101.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
          animate={{ 
            d: "M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,197.3C672,192,768,128,864,106.7C960,85,1056,107,1152,133.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.svg>
    </div>
  );

  // Enhanced Free Badge with better mobile positioning
  const FreeBadge = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      className="absolute -top-2 right-2 md:right-10 z-10 max-w-[140px] md:max-w-none"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-xl rounded-full" />
        
        {/* Main badge */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-2 md:py-3 
                    rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative hidden md:block">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/20 rounded-full blur-sm"
              />
              <Gift size={24} className="relative" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-sm md:text-lg leading-tight whitespace-nowrap">100% Free</span>
              <span className="text-[10px] md:text-xs text-white/90 whitespace-nowrap">No Credit Card Required</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Trust Indicators with enhanced styling
  const TrustIndicators = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="mt-12 flex flex-wrap justify-center gap-8"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm"
      >
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="text-green-500" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">No Credit Card</span>
          <span className="text-sm text-gray-600">Required Ever</span>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm"
      >
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <Heart className="text-red-500" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">Built with Love</span>
          <span className="text-sm text-gray-600">For Your Success</span>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm"
      >
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <Shield className="text-indigo-500" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">Privacy Focused</span>
          <span className="text-sm text-gray-600">Your Data is Safe</span>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <WaveBackground />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32 relative">
        {/* Decorative elements */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-indigo-200 to-purple-200 rounded-full filter blur-3xl opacity-30"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto relative"
        >
          <FreeBadge />

          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 relative"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl"
            />
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center transform rotate-12 shadow-xl relative">
              <span className="text-4xl text-white font-bold">Q</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Transform Your Life,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              One Day at a Time
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed"
          >
            Your personal companion in breaking unwanted habits and building a healthier lifestyle.
            Track progress, earn achievements, and transform your life - completely free, no hidden costs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl
                       hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium group shadow-lg hover:shadow-xl"
            >
              Start Your Journey
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl
                       border-2 border-indigo-100 hover:border-indigo-200 transition-all duration-200 font-medium hover:shadow-md"
            >
              Sign In
            </Link>
          </motion.div>

          <TrustIndicators />
        </motion.div>
      </div>

      {/* Features Section with Enhanced Design */}
      <div className="bg-white py-20 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose QuitOra?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We believe in making habit transformation accessible to everyone. That's why QuitOra is and will always be completely free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 
                         transition-all duration-200 hover:shadow-lg group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-50"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Benefits Section with Enhanced Visuals */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Everything You Need to Succeed
            </h2>
            <div className="space-y-6">
              {[
                "Track multiple habits simultaneously",
                "Visual progress tracking and statistics",
                "Achievement system to keep you motivated",
                "Daily check-ins and streak tracking",
                "Beautiful and intuitive interface",
                "100% free forever - no hidden costs"
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Donation Section with Updated Design */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-20 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl" />
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto flex items-center justify-center relative">
                <Coffee className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Support Our Mission</h2>
            <p className="text-gray-600 mb-8">
              Love using QuitOra? Consider supporting our mission to help more people break bad habits.
            </p>
            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex flex-col items-center"
              >
                <button
                  onClick={handleDonationClick}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                           text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl 
                           transition-all duration-200 cursor-pointer"
                >
                  <Coffee className="w-5 h-5" />
                  Buy us a coffee
                </button>
                <span className="text-sm text-gray-500 mt-2">Support Available After Sign In</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <span className="text-xl font-bold text-gray-900">QuitOra</span>
          </motion.div>
          <p className="text-gray-600">
            © {new Date().getFullYear()} QuitOra. Made with ❤️ for a better you.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 