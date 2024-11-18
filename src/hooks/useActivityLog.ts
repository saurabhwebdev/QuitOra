import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { activityLogService, ActivityLog } from '../services/activityLog';

export const useActivityLog = () => {
  const { currentUser } = useAuth();

  const logActivity = useCallback(async (
    activityData: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'deviceInfo'>
  ) => {
    if (!currentUser) return;

    try {
      await activityLogService.logActivity({
        ...activityData,
        userId: currentUser.uid
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, [currentUser]);

  const templates = activityLogService.templates;

  return {
    logActivity,
    templates
  };
}; 