import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

const StudentGradesPage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-white dark:bg-navy-900 p-8"
  >
    <div className="flex items-center gap-3 mb-6">
      <CheckSquare className="w-8 h-8 text-blue-500" />
      <h1 className="text-3xl font-bold">My Grades</h1>
    </div>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">View your grades for all courses. Your grade details will be shown here, fetched from the backend.</p>
    <div className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-navy-800 dark:to-navy-900 p-8 border border-blue-100 dark:border-navy-700">
      {/* Later: Render grades table here */}
      <div className="text-center text-gray-400 dark:text-gray-500 italic">Grades data will be displayed here after connecting to the backend.</div>
    </div>
  </motion.div>
);

export default StudentGradesPage;
