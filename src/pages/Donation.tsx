import { motion } from 'framer-motion';
import { Coffee, Heart, Gift, Star, Sparkles, ArrowRight } from 'lucide-react';
import { fadeIn, containerVariants } from '../utils/animations';

const Donation = () => {
  const donationTiers = [
    {
      amount: '5',
      title: 'Supporter',
      description: 'Help us keep the lights on',
      perks: ['Support Development', 'Our Eternal Gratitude'],
      icon: Coffee,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      amount: '10',
      title: 'Enthusiast',
      description: 'Fuel our development journey',
      perks: ['Support Development', 'Special Thanks Badge', 'Early Access to Features'],
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      amount: '25',
      title: 'Champion',
      description: 'Become a vital part of our mission',
      perks: [
        'Support Development',
        'Special Thanks Badge',
        'Early Access to Features',
        'Priority Support'
      ],
      icon: Gift,
      color: 'from-amber-500 to-amber-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
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
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-6xl mx-auto px-4 py-12 relative"
      >
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative mb-6 inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-xl" />
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center relative">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Support QuitOra</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your support helps us maintain and improve QuitOra, keeping it free for everyone while adding new features.
          </p>
        </div>

        {/* Donation Tiers */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {donationTiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.title}
                variants={fadeIn}
                custom={index}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="relative group"
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`
                  h-full bg-white rounded-2xl shadow-sm p-8 border-2 
                  ${tier.popular ? 'border-indigo-200' : 'border-gray-100'}
                  hover:border-indigo-300 transition-all duration-300
                  transform-gpu
                `}>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} 
                                   flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">${tier.amount}</div>
                      <div className="text-gray-500 text-sm">One-time</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{tier.title}</h3>
                  <p className="text-gray-600 mb-6">{tier.description}</p>

                  <div className="space-y-3 mb-8">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-600">
                        <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        </div>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2
                      ${tier.popular 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md' 
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                      }
                      transition-all duration-200
                    `}
                  >
                    Choose {tier.title}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          variants={fadeIn}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why Support Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Coffee className="w-6 h-6 text-indigo-600" />,
                title: "Keep QuitOra Free",
                description: "Help us maintain our commitment to keeping QuitOra free for everyone"
              },
              {
                icon: <Star className="w-6 h-6 text-purple-600" />,
                title: "Support Development",
                description: "Enable us to develop new features and improve existing ones"
              },
              {
                icon: <Heart className="w-6 h-6 text-pink-600" />,
                title: "Join Our Mission",
                description: "Be part of our journey to help people break bad habits"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                custom={index}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={fadeIn}
          className="text-center mt-12"
        >
          <p className="text-gray-500">
            Your support means the world to us! Every contribution helps us continue our mission. ❤️
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Donation; 