import React from 'react';
import { motion } from 'framer-motion';

const FacultyGradesPage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-white dark:bg-navy-900 p-8"
  >
    <h1 className="text-3xl font-bold mb-4">Grades</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">View and manage grades for your students.</p>
    {/* Add animated grades table or cards here */}
    <div className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-navy-800 dark:to-navy-900 p-6 border border-blue-100 dark:border-navy-700">
      <h2 className="text-xl font-semibold mb-2">Gradebook</h2>
      <p className="text-md text-gray-600 dark:text-gray-300">Grade details and actions go here.</p>
    </div>
  </motion.div>
);

export default FacultyGradesPage;
