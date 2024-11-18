import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Coffee, Star, Gift, Shield, Check, X, Loader2 } from 'lucide-react';
import { containerVariants, fadeIn } from '../utils/animations';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { donationService } from '../services/donationService';
import { useNavigate } from 'react-router-dom';

if (!process.env.REACT_APP_PAYPAL_CLIENT_ID) {
  throw new Error('PayPal Client ID is not configured');
}

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID as string;

// Add interfaces for better type safety
interface DonationTierType {
  amount: string;
  title: string;
  description: string;
  perks: string[];
  icon: any; // You might want to be more specific with the icon type
  color: string;
  popular?: boolean;
}

interface PaymentSectionProps {
  selectedTier: DonationTierType;
  onClose: () => void;
  isProcessing: boolean;
  currentUser: any; // Replace 'any' with your actual user type
}

// Update DonationTier props interface
interface DonationTierProps {
  tier: DonationTierType;
  onSelect: () => void;
}

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      >
        <div className="min-h-screen px-4 text-center">
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="inline-block w-full max-w-lg my-8 p-6 overflow-hidden text-left align-middle 
                     bg-white rounded-2xl shadow-2xl transform transition-all relative"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="max-h-[80vh] overflow-y-auto pr-2">
              {children}
            </div>
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const PaymentSection = ({ selectedTier, onClose, isProcessing, currentUser }: PaymentSectionProps) => (
  <div className="p-8">
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Donation</h3>
      <p className="text-gray-600">
        You're supporting us with the {selectedTier.title} tier
      </p>
    </div>

    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Amount:</span>
        <span className="font-medium text-indigo-600">${selectedTier.amount}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tier:</span>
        <span className="font-medium text-indigo-600">{selectedTier.title}</span>
      </div>
    </div>

    <div className="space-y-4 mb-6">
      <h4 className="font-medium text-gray-800">Included Benefits:</h4>
      <div className="space-y-2">
        {selectedTier.perks.map((perk, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">{perk}</span>
          </div>
        ))}
      </div>
    </div>

    <PayPalButtons
      style={{ 
        layout: "vertical",
        shape: "pill",
        color: "blue"
      }}
      disabled={isProcessing}
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [{
            amount: {
              currency_code: "USD",
              value: selectedTier.amount
            },
            description: `QuitOra ${selectedTier.title} Tier Donation`
          }]
        });
      }}
      onApprove={async (data, actions) => {
        if (!actions.order) {
          toast.error('Payment failed. Please try again.');
          return;
        }
        
        try {
          const order = await actions.order.capture();
          if (!order || !order.id) {
            throw new Error('Invalid order data');
          }
          
          await donationService.saveDonation({
            userId: currentUser?.uid || 'anonymous',
            amount: selectedTier.amount,
            orderId: order.id,
            timestamp: new Date(),
            tier: selectedTier.title,
            status: 'completed'
          });
          
          toast.success('Thank you for your support! 🎉');
          onClose();
        } catch (error) {
          console.error('Payment error:', error);
          toast.error('Payment failed. Please try again.');
        }
      }}
      onError={(err) => {
        console.error('PayPal error:', err);
        toast.error('Payment failed. Please try again.');
      }}
      onCancel={() => {
        toast('Payment cancelled', { icon: '❌' });
      }}
    />

    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
      <Shield className="w-4 h-4" />
      <span>Secure payment powered by PayPal</span>
    </div>
  </div>
);

const DonationTier = ({ tier, onSelect }: { tier: DonationTierType; onSelect: () => void }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative p-6 rounded-2xl transition-all duration-300 cursor-pointer
      bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-lg"
    onClick={onSelect}
  >
    {tier.popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </span>
      </div>
    )}

    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} 
                    flex items-center justify-center shadow-md mb-4`}>
      <tier.icon className="w-6 h-6 text-white" />
    </div>

    <h3 className="text-xl font-bold text-gray-800 mb-2">{tier.title}</h3>
    <div className="text-2xl font-bold text-indigo-600 mb-4">${tier.amount}</div>
    <p className="text-gray-600 mb-4">{tier.description}</p>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                 text-white rounded-xl font-medium shadow-md hover:shadow-lg 
                 transition-shadow duration-200"
    >
      Select & Continue
    </motion.button>

    <div className="mt-4 space-y-3">
      {tier.perks.map((perk, index) => (
        <div key={index} className="flex items-start gap-2">
          <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <span className="text-sm text-gray-600">{perk}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const Donation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<DonationTierType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please sign in to make a donation');
      navigate('/login', { state: { from: '/donation' } });
    }
  }, [currentUser, navigate]);

  const donationTiers = [
    {
      amount: '5',
      title: 'Supporter',
      description: 'Perfect for individuals who want to help',
      perks: [
        'Support Our Mission',
        'Supporter Badge',
        'Monthly Newsletter'
      ],
      icon: Coffee,
      color: 'from-blue-500 to-blue-600'
    },
    {
      amount: '10',
      title: 'Enthusiast',
      description: 'For those who believe in our cause',
      perks: [
        'All Supporter Benefits',
        'Early Access to Features',
        'Priority Email Support',
        'Exclusive Updates'
      ],
      icon: Star,
      color: 'from-indigo-500 to-indigo-600',
      popular: true
    },
    {
      amount: '25',
      title: 'Champion',
      description: 'Be a crucial part of our journey',
      perks: [
        'All Enthusiast Benefits',
        'Direct Developer Access',
        'Feature Request Priority',
        'Name in Contributors List',
        'Custom Profile Badge'
      ],
      icon: Gift,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <PayPalScriptProvider options={{ 
      clientId: PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture"
    }}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 
                         rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support Our Mission
            </h1>
            <p className="text-xl text-gray-600">
              Your contribution helps us maintain and improve QuitOra, ensuring it remains 
              free and effective for everyone breaking bad habits.
            </p>
          </div>

          {/* Tiers Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {donationTiers.map((tier) => (
              <DonationTier
                key={tier.title}
                tier={tier}
                onSelect={() => {
                  setSelectedTier(tier);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>

          {/* Payment Modal */}
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTier(null);
            }}
          >
            {selectedTier && (
              <PaymentSection
                selectedTier={selectedTier}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedTier(null);
                }}
                isProcessing={isProcessing}
                currentUser={currentUser}
              />
            )}
          </Modal>

          {/* Trust Indicators */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Secure Payments',
                description: 'All transactions are encrypted and secure'
              },
              {
                icon: Heart,
                title: 'Direct Impact',
                description: 'Your support directly funds development'
              },
              {
                icon: Star,
                title: 'Transparent Use',
                description: 'We openly share how funds are used'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                custom={index}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-xl 
                              flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default Donation; 