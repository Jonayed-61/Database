import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import ThemeDemo from '../pages/ThemeDemo';
import ComponentDemo from '../pages/ComponentDemo';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import DatabaseViewer from '../pages/DatabaseViewer';
import { ProtectedRoute, SessionTimeout } from '../components/auth';
import { useAuth } from '../contexts/AuthContext';

const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = user?.role?.toLowerCase();
  if (role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

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

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true}>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute requireAuth={true}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes (redirect to home if already authenticated) */}
        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false} redirectAuthenticated={true}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute requireAuth={false} redirectAuthenticated={true}>
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

        {/* Database Viewer Route */}
        <Route path="/database" element={<DatabaseViewer />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
