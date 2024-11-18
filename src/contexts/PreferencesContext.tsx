import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userPreferencesService } from '../services/userPreferences';

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      userPreferencesService.subscribeToPreferences(currentUser.uid);
    }

    return () => {
      userPreferencesService.unsubscribeFromPreferences();
    };
  }, [currentUser]);

  return <>{children}</>;
}; 