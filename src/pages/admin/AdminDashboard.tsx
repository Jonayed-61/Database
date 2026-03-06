
import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../components/ui/StatsCard';
import Tabs from '../../components/ui/Tabs';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { UserCog, Database, Settings, Users, BarChart2, ShieldCheck, FileText, RefreshCw, Bell, Key, Activity, LifeBuoy, Server, Lock } from 'lucide-react';
import UserManagement from './UserManagement';


const AdminDashboard: React.FC = () => {
  // Example stats (replace with real data from backend)
  const stats: import('../../components/ui/StatsCard').StatsCardProps[] = [
    { title: 'Total Users', value: 1243, icon: <Users />, color: 'gold' },
    { title: 'Active Sessions', value: 87, icon: <UserCog />, color: 'success' },
    { title: 'DB Tables', value: 18, icon: <Database />, color: 'navy' },
    { title: 'System Health', value: 99, suffix: '%', icon: <ShieldCheck />, color: 'success' },
  ];

  // Example tabs for admin features
  const adminTabs = [
    {
      id: 'users',
      label: 'User Management',
      icon: <Users />,
      content: <UserManagement />,
    },
    {
      id: 'database',
      label: 'Database Editor',
      icon: <Database />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Database className="inline-block w-6 h-6 text-blue-500 animate-spin-slow" /> Database Editor</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Full access to view, edit, and manage all database tables and records.</p>
          <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-500/20 p-6 shadow-lg">
            {React.createElement(require('../DatabaseViewer').default)}
          </div>
        </div>
      ),
    },
    {
      id: 'logs',
      label: 'System Logs',
      icon: <FileText />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><FileText className="inline-block w-6 h-6 text-orange-500 animate-pulse" /> System Logs</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Monitor system activity and logs in real time.</p>
          <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-700/20 border border-orange-500/20 p-6 shadow-lg animate-fade-in text-center text-gray-400">[System logs and activity feed coming soon]</div>
        </div>
      ),
    },
    {
      id: 'backup',
      label: 'Backup & Restore',
      icon: <RefreshCw />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><RefreshCw className="inline-block w-6 h-6 text-cyan-500 animate-spin" /> Backup & Restore</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Backup and restore the database with progress animations.</p>
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-700/20 border border-cyan-500/20 p-6 shadow-lg animate-fade-in text-center text-gray-400">[Backup and restore tools coming soon]</div>
        </div>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BarChart2 className="inline-block w-6 h-6 text-purple-500 animate-bounce" /> Analytics</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Animated graphs and charts for system usage, growth, and more.</p>
          <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/20 p-6 shadow-lg animate-fade-in text-center text-gray-400">[Analytics and charts coming soon]</div>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Settings className="inline-block w-6 h-6 text-green-500 animate-spin-slow" /> Settings</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Manage system settings, theme, security, and notifications.</p>
          <div className="rounded-xl bg-gradient-to-br from-green-500/20 to-green-700/20 border border-green-500/20 p-6 shadow-lg animate-fade-in text-center text-gray-400">[Settings panel coming soon]</div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Bell className="inline-block w-6 h-6 text-pink-500 animate-bounce" /> Notifications</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Real-time notifications and alerts for admins.</p>
          <div className="rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-700/20 border border-pink-500/20 p-6 shadow-lg animate-fade-in text-center text-gray-400">[Notifications center coming soon]</div>
        </div>
      ),
    },
    {
      id: 'access',
      label: 'Access Control',
      icon: <Key />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Key className="inline-block w-6 h-6 text-yellow-500 animate-pulse" /> Access Control</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Manage roles and permissions visually.</p>
          <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 border border-yellow-500/20 p-6 shadow-lg animate-fade-in text-center text-gray-400">[Access control tools coming soon]</div>
        </div>
      ),
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: <Activity />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Activity className="inline-block w-6 h-6 text-red-500 animate-bounce" /> Audit Trail</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">See who changed what and when.</p>
          <div className="rounded-xl bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/20 p-6 shadow-lg animate-fade-in text-center text-gray-400">[Audit trail coming soon]</div>
        </div>
      ),
    },
    {
      id: 'support',
      label: 'Support & Feedback',
      icon: <LifeBuoy />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><LifeBuoy className="inline-block w-6 h-6 text-sky-500 animate-bounce" /> Support & Feedback</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">View and respond to user feedback and support requests.</p>
          <div className="rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-700/20 border border-sky-500/20 p-6 shadow-lg animate-fade-in text-center text-gray-400">[Support and feedback tools coming soon]</div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-gradient-to-br from-[#1a2236] to-[#050b18] p-0 md:p-8 flex flex-col"
    >
      {/* Breadcrumbs */}
      <div className="pt-8 px-4 md:px-0">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/', icon: <Database className="w-4 h-4" /> },
            { label: 'Admin', href: '/admin/dashboard', icon: <ShieldCheck className="w-4 h-4" /> },
            { label: 'Dashboard' },
          ]}
        />
      </div>

      {/* Animated Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 px-4 md:px-0">
        {stats.map((stat, idx) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Admin Feature Tabs */}
      <div className="mt-10 px-4 md:px-0">
        <Tabs tabs={adminTabs} variant="pills" />
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
