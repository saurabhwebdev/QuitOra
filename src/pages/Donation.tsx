import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Star, Gift, Shield, Check, Loader2 } from 'lucide-react';
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
  onCancel: () => void;
  isProcessing: boolean;
  currentUser: any; // Replace 'any' with your actual user type
}

// Update DonationTier props interface
interface DonationTierProps {
  tier: DonationTierType;
  isSelected: boolean;
  onSelect: (tier: DonationTierType) => void;
}

const DonationTier = ({ tier, isSelected, onSelect }: DonationTierProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`relative p-6 rounded-2xl transition-all duration-300 cursor-pointer
      ${isSelected 
        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-500 shadow-lg' 
        : 'bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md'}`}
    onClick={() => onSelect(tier)}
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

    <div className="space-y-3">
      {tier.perks.map((perk: string, index: number) => (
        <div key={index} className="flex items-start gap-2">
          <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <span className="text-gray-600">{perk}</span>
        </div>
      ))}
    </div>

    {isSelected && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 border-2 border-indigo-500 rounded-2xl pointer-events-none"
      />
    )}
  </motion.div>
);

const PaymentSection = ({ selectedTier, onCancel, isProcessing, currentUser }: PaymentSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
  >
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Secure Donation</h3>
      <p className="text-gray-600">
        You selected the {selectedTier.title} tier (${selectedTier.amount})
      </p>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Amount:</span>
        <span className="font-medium">${selectedTier.amount}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tier:</span>
        <span className="font-medium">{selectedTier.title}</span>
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
          onCancel();
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

    <button
      onClick={onCancel}
      disabled={isProcessing}
      className="w-full mt-4 text-gray-500 text-sm hover:text-gray-700 disabled:opacity-50"
    >
      Cancel
    </button>

    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
      <Shield className="w-4 h-4" />
      <span>Secure payment powered by PayPal</span>
    </div>
  </motion.div>
);

const Donation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<DonationTierType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
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
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {donationTiers.map((tier, index) => (
              <DonationTier
                key={tier.title}
                tier={tier}
                isSelected={selectedTier === tier}
                onSelect={setSelectedTier}
              />
            ))}
          </div>

          {/* Payment Section */}
          {selectedTier && (
            <PaymentSection
              selectedTier={selectedTier}
              onCancel={() => setSelectedTier(null)}
              isProcessing={isProcessing}
              currentUser={currentUser}
            />
          )}

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