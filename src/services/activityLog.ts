import { 
  collection, query, where, orderBy, limit, getDocs, 
  addDoc, Timestamp, DocumentData, QueryDocumentSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export type ActivityType = 'success' | 'warning' | 'info' | 'error' | 'security' | 'habit';

export interface ActivityLog {
  id: string;
  userId: string;
  type: ActivityType;
  category: 'auth' | 'profile' | 'habit' | 'security' | 'system';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  deviceInfo?: {
    browser: string;
    os: string;
    device: string;
    ip?: string;
  };
}

const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Detect browser
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  // Detect OS
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "MacOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS")) os = "iOS";

  // Detect device type
  if (ua.includes("Mobile")) device = "Mobile";
  else if (ua.includes("Tablet")) device = "Tablet";

  return { browser, os, device };
};

export const activityLogService = {
  async getRecentActivity(
    userId: string, 
    options: {
      limit?: number;
      category?: ActivityLog['category'];
      type?: ActivityType;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<ActivityLog[]> {
    try {
      let q = query(
        collection(db, 'activityLogs'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      // Apply filters
      if (options.category) {
        q = query(q, where('category', '==', options.category));
      }
      if (options.type) {
        q = query(q, where('type', '==', options.type));
      }
      if (options.startDate) {
        q = query(q, where('timestamp', '>=', Timestamp.fromDate(options.startDate)));
      }
      if (options.endDate) {
        q = query(q, where('timestamp', '<=', Timestamp.fromDate(options.endDate)));
      }
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(this.convertToActivityLog);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  },

  async logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp' | 'deviceInfo'>) {
    try {
      const deviceInfo = getBrowserInfo();
      
      await addDoc(collection(db, 'activityLogs'), {
        ...activity,
        timestamp: Timestamp.now(),
        deviceInfo
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  },

  // Helper method to convert Firestore doc to ActivityLog
  convertToActivityLog(doc: QueryDocumentSnapshot<DocumentData>): ActivityLog {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate()
    } as ActivityLog;
  },

  // Predefined activity log templates
  templates: {
    auth: {
      login: (email: string) => ({
        category: 'auth' as const,
        type: 'success' as const,
        title: 'Login Successful',
        description: `Successfully logged in with ${email}`,
      }),
      loginFailed: (email: string) => ({
        category: 'auth' as const,
        type: 'error' as const,
        title: 'Login Failed',
        description: `Failed login attempt for ${email}`,
      }),
      logout: () => ({
        category: 'auth' as const,
        type: 'info' as const,
        title: 'Logged Out',
        description: 'Successfully logged out of account',
      }),
      passwordReset: () => ({
        category: 'security' as const,
        type: 'success' as const,
        title: 'Password Reset',
        description: 'Password was successfully reset',
      }),
      passwordResetRequested: (email: string) => ({
        category: 'security' as const,
        type: 'info' as const,
        title: 'Password Reset Requested',
        description: `Password reset requested for ${email}`,
      })
    },
    profile: {
      emailUpdated: (newEmail: string) => ({
        category: 'profile' as const,
        type: 'success' as const,
        title: 'Email Updated',
        description: `Email address updated to ${newEmail}`,
      }),
      nameUpdated: (newName: string) => ({
        category: 'profile' as const,
        type: 'success' as const,
        title: 'Name Updated',
        description: `Display name updated to ${newName}`,
      }),
      preferencesUpdated: (setting: string) => ({
        category: 'profile' as const,
        type: 'info' as const,
        title: 'Preferences Updated',
        description: `Updated ${setting} preferences`,
      })
    },
    habit: {
      created: (habitName: string) => ({
        category: 'habit' as const,
        type: 'success' as const,
        title: 'Habit Created',
        description: `Created new habit: ${habitName}`,
      }),
      deleted: (habitName: string) => ({
        category: 'habit' as const,
        type: 'warning' as const,
        title: 'Habit Deleted',
        description: `Deleted habit: ${habitName}`,
      }),
      checkIn: (habitName: string) => ({
        category: 'habit' as const,
        type: 'success' as const,
        title: 'Habit Check-in',
        description: `Checked in for habit: ${habitName}`,
      })
    }
  }
}; 