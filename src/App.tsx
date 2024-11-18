import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddHabit from './pages/AddHabit';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import { Toast } from './components/Toast';
import { useAuth } from './contexts/AuthContext';
import Donation from './pages/Donation';
import Feedback from './pages/Feedback';
import ForgotPassword from './pages/ForgotPassword';
import { PreferencesProvider } from './contexts/PreferencesContext';
import './i18n/config';
import { useLanguageSync } from './hooks/useLanguageSync';

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/add-habit" 
          element={
            <PrivateRoute>
              <AddHabit />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/donation" 
          element={
            <PrivateRoute>
              <Donation />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/feedback" 
          element={
            <PrivateRoute>
              <Feedback />
            </PrivateRoute>
          } 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useLanguageSync();

  return (
    <AuthProvider>
      <PreferencesProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AppRoutes />
          </div>
          <Toast />
        </Router>
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;
