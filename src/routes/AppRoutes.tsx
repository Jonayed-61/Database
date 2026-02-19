import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import ThemeDemo from '../pages/ThemeDemo';
import ComponentDemo from '../pages/ComponentDemo';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import { ProtectedRoute, SessionTimeout } from '../components/auth';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <SessionTimeout />
      <Routes>
        {/* Protected Home Page - requires authentication */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireAuth={true}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requireAuth={true}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Auth Routes (redirect to home if already authenticated) */}
        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false} redirectAuthenticated={false}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute requireAuth={false} redirectAuthenticated={false}>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute requireAuth={false}>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Demo Routes */}
        <Route path="/demo" element={<ThemeDemo />} />
        <Route path="/components" element={<ComponentDemo />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
