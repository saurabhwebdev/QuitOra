import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useActivityLog } from '../hooks/useActivityLog';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (newEmail: string, password: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  logout: () => Promise<any>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logActivity, templates } = useActivityLog();

  async function register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (err: any) {
      console.error('Registration error:', err);
      throw new Error(err.message || 'Failed to register');
    }
  }

  async function login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await logActivity(templates.auth.login(email));
      toast.success(t('auth.loginSuccess'));
      return result;
    } catch (err: any) {
      await logActivity(templates.auth.loginFailed(email));
      toast.error(t('auth.loginError'));
      throw err;
    }
  }

  async function logout() {
    try {
      await logActivity(templates.auth.logout());
      await signOut(auth);
    } catch (err: any) {
      throw err;
    }
  }

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (err: any) {
      console.error('Google login error:', err);
      throw new Error(err.message || 'Failed to login with Google');
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      await logActivity(templates.auth.passwordResetRequested(email));
    } catch (err: any) {
      throw err;
    }
  }

  async function reauthenticate(password: string) {
    if (!currentUser?.email) throw new Error('No user email found');
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
  }

  async function updateUserEmail(newEmail: string, password: string) {
    if (!currentUser) throw new Error('No user found');
    try {
      await reauthenticate(password);
      await updateEmail(currentUser, newEmail);
    } catch (err: any) {
      console.error('Email update error:', err);
      throw new Error(err.message || 'Failed to update email');
    }
  }

  async function updateUserPassword(currentPassword: string, newPassword: string) {
    if (!currentUser) throw new Error('No user found');
    try {
      await reauthenticate(currentPassword);
      await updatePassword(currentUser, newPassword);
    } catch (err: any) {
      console.error('Password update error:', err);
      throw new Error(err.message || 'Failed to update password');
    }
  }

  async function updateUserProfile(displayName: string) {
    if (!currentUser) throw new Error('No user found');
    try {
      await updateProfile(currentUser, { displayName });
    } catch (err: any) {
      console.error('Profile update error:', err);
      throw new Error(err.message || 'Failed to update profile');
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    loginWithGoogle,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    updateUserProfile,
    logout,
    loading,
    error
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 