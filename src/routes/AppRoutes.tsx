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
import ProgramsPage from '../pages/ProgramsPage';
import NewsPage from '../pages/NewsPage';
import EventsPage from '../pages/EventsPage';
import AboutPage from '../pages/AboutPage';
import FacultyCoursesPage from '../pages/faculty/FacultyCoursesPage';
import FacultyStudentsPage from '../pages/faculty/FacultyStudentsPage';
import FacultyAttendancePage from '../pages/faculty/FacultyAttendancePage';
import FacultyGradesPage from '../pages/faculty/FacultyGradesPage';
import FacultyReportsPage from '../pages/faculty/FacultyReportsPage';
import StudentOverviewPage from '../pages/student/StudentOverviewPage';
import StudentRegistrationPage from '../pages/student/StudentRegistrationPage';
import StudentGradesPage from '../pages/student/StudentGradesPage';
import StudentAttendancePage from '../pages/student/StudentAttendancePage';
import StudentFeesPage from '../pages/student/StudentFeesPage';
import AdminDashboard from '../pages/admin/AdminDashboard';

const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = user?.role?.toLowerCase();
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};
        {/* Admin Section Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAuth={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

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

        {/* Main Navigation Sections */}
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Faculty Section Routes */}
        <Route path="/faculty/courses" element={<FacultyCoursesPage />} />
        <Route path="/faculty/students" element={<FacultyStudentsPage />} />
        <Route path="/faculty/attendance" element={<FacultyAttendancePage />} />
        <Route path="/faculty/grades" element={<FacultyGradesPage />} />
        <Route path="/faculty/reports" element={<FacultyReportsPage />} />

        {/* Student Section Routes */}
        <Route path="/student/overview" element={<StudentOverviewPage />} />
        <Route path="/student/registration" element={<StudentRegistrationPage />} />
        <Route path="/student/grades" element={<StudentGradesPage />} />
        <Route path="/student/attendance" element={<StudentAttendancePage />} />
        <Route path="/student/fees" element={<StudentFeesPage />} />

        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
