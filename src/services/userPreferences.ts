import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { create } from 'zustand';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  accentColor: string;
  notifications: {
    push: boolean;
    email: boolean;
    reminders: boolean;
  };
}

interface PreferencesStore {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  unsubscribe: (() => void) | null;
  setUnsubscribe: (unsubscribe: (() => void) | null) => void;
}

export const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  accentColor: '#6366F1',
  notifications: {
    push: true,
    email: true,
    reminders: true
  }
};

// Create a Zustand store for preferences
export const usePreferencesStore = create<PreferencesStore>((set) => ({
  preferences: defaultPreferences,
  setPreferences: (prefs: UserPreferences) => set({ preferences: prefs }),
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
  unsubscribe: null,
  setUnsubscribe: (unsubscribe: (() => void) | null) => set({ unsubscribe })
}));

export const userPreferencesService = {
  subscribeToPreferences(userId: string) {
    const { setPreferences, setLoading, setUnsubscribe } = usePreferencesStore.getState();

    // Unsubscribe from previous listener if exists
    this.unsubscribeFromPreferences();

    const docRef = doc(db, 'userPreferences', userId);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, 
      (doc) => {
        if (doc.exists()) {
          setPreferences(doc.data() as UserPreferences);
        } else {
          // If no preferences exist, create default ones
          setDoc(docRef, defaultPreferences);
          setPreferences(defaultPreferences);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to preferences:', error);
        setLoading(false);
      }
    );

    setUnsubscribe(unsubscribe);
  },

  unsubscribeFromPreferences() {
    const { unsubscribe } = usePreferencesStore.getState();
    if (unsubscribe) {
      unsubscribe();
    }
  },

  async updateTheme(userId: string, theme: UserPreferences['theme']) {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      await updateDoc(docRef, { theme });
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  },

  async updateLanguage(userId: string, language: string) {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      await updateDoc(docRef, { language });
    } catch (error) {
      console.error('Error updating language:', error);
      throw error;
    }
  },

  async updateAccentColor(userId: string, accentColor: string) {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      await updateDoc(docRef, { accentColor });
    } catch (error) {
      console.error('Error updating accent color:', error);
      throw error;
    }
  },

  async updateNotifications(userId: string, notifications: UserPreferences['notifications']) {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      await updateDoc(docRef, { notifications });
    } catch (error) {
      console.error('Error updating notifications:', error);
      throw error;
    }
  }
}; 