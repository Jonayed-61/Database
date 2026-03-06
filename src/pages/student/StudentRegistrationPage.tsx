import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const StudentRegistrationPage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-white dark:bg-navy-900 p-8"
  >
    <div className="flex items-center gap-3 mb-6">
      <BookOpen className="w-8 h-8 text-gold-500" />
      <h1 className="text-3xl font-bold">Course Registration</h1>
    </div>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Register for your courses for the semester. You will see available courses and your current registrations here.</p>
    <div className="rounded-xl shadow-lg bg-gradient-to-br from-gold-50 to-white dark:from-navy-800 dark:to-navy-900 p-8 border border-gold-100 dark:border-navy-700">
      {/* Later: Render available courses and registration form here */}
      <div className="text-center text-gray-400 dark:text-gray-500 italic">Course registration functionality coming soon. Data will be fetched from the backend.</div>
    </div>
  </motion.div>
);

export default StudentRegistrationPage;
