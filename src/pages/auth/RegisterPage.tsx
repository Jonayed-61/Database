import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData, UserRole } from '../../types/auth.types';
import { calculatePasswordStrength } from '../../utils/auth.utils';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.string().refine((val) => ['student', 'faculty', 'admin'].includes(val), {
      message: 'Invalid role selected',
    }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const STEPS = [
  { id: 1, title: 'Account Info', icon: '👤' },
  { id: 2, title: 'Role Selection', icon: '🎓' },
  { id: 3, title: 'Profile Picture', icon: '📸' },
  { id: 4, title: 'Verification', icon: '✅' },
];

const ROLES: { value: UserRole; label: string; description: string; icon: string }[] = [
  {
    value: 'student',
    label: 'Student',
    description: 'Access courses, assignments, and grades',
    icon: '🎓',
  },
  {
    value: 'faculty',
    label: 'Faculty',
    description: 'Manage courses and student records',
    icon: '👨‍🏫',
  },
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Full system access and management',
    icon: '⚙️',
  },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      agreeToTerms: false,
    },
  });

  const password = watch('password');
  const role = watch('role');
  const passwordStrength = calculatePasswordStrength(password);

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger(['email', 'firstName', 'lastName', 'password', 'confirmPassword']);
        break;
      case 2:
        isValid = await trigger(['role']);
        break;
      case 3:
        isValid = true; // Profile picture is optional
        break;
      case 4:
        isValid = await trigger(['agreeToTerms']);
        break;
      default:
        isValid = false;
    }

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData: RegisterData = {
        ...data,
        role: data.role as UserRole,
        profilePicture: profilePicture || undefined,
      };
      await registerUser(registerData);
      // Navigate to student dashboard after successful registration
      navigate('/student/dashboard', { replace: true });
    } catch (error) {
      // Error is handled by AuthContext with toast
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">
              Create Your Account
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  {...register('firstName')}
                  type="text"
                  placeholder="First Name"
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:border-primary-500 dark:bg-navy-700 dark:text-white`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register('lastName')}
                  type="text"
                  placeholder="Last Name"
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:border-primary-500 dark:bg-navy-700 dark:text-white`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email Address"
                className={`w-full px-4 py-3 border-2 rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:border-primary-500 dark:bg-navy-700 dark:text-white`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-3 border-2 rounded-lg ${
                  errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:border-primary-500 dark:bg-navy-700 dark:text-white`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Password Strength
                    </span>
                    <span className="text-sm font-semibold" style={{ color: passwordStrength.color.replace('bg-', '') }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 border-2 rounded-lg ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:border-primary-500 dark:bg-navy-700 dark:text-white`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">
              Select Your Role
            </h3>

            <div className="space-y-3">
              {ROLES.map((roleOption) => (
                <motion.div
                  key={roleOption.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setValue('role', roleOption.value)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    role === roleOption.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{roleOption.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-navy-900 dark:text-white">
                        {roleOption.label}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {roleOption.description}
                      </p>
                    </div>
                    {role === roleOption.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-primary-600"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-6"
          >
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">
              Upload Profile Picture
            </h3>

            <div className="flex flex-col items-center">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-navy-700"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </motion.div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                SVG, PNG, JPG or GIF (max. 2MB)
              </p>

              {profilePicture && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="button"
                  onClick={() => {
                    setProfilePicture(null);
                    setPreviewUrl('');
                  }}
                  className="mt-4 text-red-600 hover:text-red-700 text-sm font-semibold"
                >
                  Remove Photo
                </motion.button>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              This step is optional. You can skip and add a photo later.
            </p>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">
              Almost Done!
            </h3>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Email Verification Required
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    We'll send a verification email to confirm your account after registration.
                  </p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('agreeToTerms')}
                type="checkbox"
                className="mt-1 w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:underline font-semibold">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline font-semibold">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-primary-800 to-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-2xl w-full"
      >
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: currentStep === step.id ? 1.1 : 1,
                        backgroundColor:
                          currentStep >= step.id
                            ? '#225ca0'
                            : 'rgba(156, 163, 175, 0.3)',
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mb-2"
                    >
                      {currentStep > step.id ? '✓' : step.icon}
                    </motion.div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-1 mx-2 bg-gray-300 dark:bg-gray-600 rounded">
                      <motion.div
                        animate={{
                          width: currentStep > step.id ? '100%' : '0%',
                        }}
                        className="h-full bg-primary-600 rounded"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-navy-700 transition-all"
                >
                  Back
                </motion.button>
              )}

              {currentStep < STEPS.length ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-lg transition-all"
                >
                  Continue
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
