import React from 'react';
import { motion } from 'framer-motion';

const FacultyCoursesPage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-white dark:bg-navy-900 p-8"
  >
    <h1 className="text-3xl font-bold mb-4">My Courses</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">View and manage all courses you are teaching this semester.</p>
    {/* Add animated cards or tables for courses here */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Example card */}
      <motion.div whileHover={{ scale: 1.03 }} className="rounded-xl shadow-lg bg-gradient-to-br from-primary-50 to-white dark:from-navy-800 dark:to-navy-900 p-6 border border-primary-100 dark:border-navy-700">
        <h2 className="text-xl font-semibold mb-2">Course Title</h2>
        <p className="text-md text-gray-600 dark:text-gray-300">Course description and details go here.</p>
      </motion.div>
    </div>
  </motion.div>
);

export default FacultyCoursesPage;
