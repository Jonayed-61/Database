import React from 'react';
import { motion } from 'framer-motion';

const FacultyAttendancePage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-white dark:bg-navy-900 p-8"
  >
    <h1 className="text-3xl font-bold mb-4">Attendance</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Track and manage student attendance for your courses.</p>
    {/* Add animated attendance table or chart here */}
    <div className="rounded-xl shadow-lg bg-gradient-to-br from-green-50 to-white dark:from-navy-800 dark:to-navy-900 p-6 border border-green-100 dark:border-navy-700">
      <h2 className="text-xl font-semibold mb-2">Attendance Overview</h2>
      <p className="text-md text-gray-600 dark:text-gray-300">Attendance stats and actions go here.</p>
    </div>
  </motion.div>
);

export default FacultyAttendancePage;
