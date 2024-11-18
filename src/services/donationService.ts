import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface DonationData {
  userId: string;
  amount: string;
  orderId: string;
  timestamp: Date;
  tier: string;
  status: 'completed' | 'failed' | 'pending';
}

export const donationService = {
  saveDonation: async (donationData: DonationData) => {
    try {
      const docRef = await addDoc(collection(db, 'donations'), {
        ...donationData,
        timestamp: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving donation:', error);
      throw error;
    }
  }
}; 