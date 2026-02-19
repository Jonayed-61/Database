# Authentication System - Quick Start Guide

## 🚀 Getting Started

Your authentication system is now fully integrated and ready to use!

## Available Routes

Navigate to these URLs to test the authentication features:

### 🔐 Authentication Pages
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`
- **Forgot Password**: `http://localhost:3000/forgot-password`

### 🏠 Other Pages
- **Home**: `http://localhost:3000/`
- **Theme Demo**: `http://localhost:3000/demo`
- **Components**: `http://localhost:3000/components`

## Testing the System

### 1. Test Registration
1. Navigate to `/register`
2. Fill in account details (email, password)
3. Watch the password strength indicator update
4. Select a role (Student, Faculty, or Admin)
5. Upload a profile picture (optional)
6. Accept terms and complete registration

### 2. Test Login
1. Navigate to `/login`
2. Use the test credentials:
   - **Email**: `student@university.edu`
   - **Password**: `password123`
3. Toggle "Remember Me" to test session persistence
4. Click "Sign In"

### 3. Test Password Recovery
1. Navigate to `/forgot-password`
2. Enter any email address
3. Enter the 6-digit OTP: `123456`
4. Set a new password
5. You'll be redirected to login

### 4. Test Session Timeout
1. Login to the system
2. Wait for the session timeout warning (will appear 5 minutes before token expiry)
3. Choose to "Continue Session" or "Logout"

### 5. Test Protected Routes

To test protected routes, uncomment the example routes in `src/routes/AppRoutes.tsx`:

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requireAuth={true}>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

Then create a simple dashboard page:

```tsx
// src/pages/DashboardPage.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg mb-4">Welcome, {user?.name}!</p>
        <p className="mb-2">Email: {user?.email}</p>
        <p className="mb-6">Role: {user?.role}</p>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
```

## Features to Explore

### 🎨 UI/UX Features
- ✨ Smooth animations with Framer Motion
- 🌗 Dark mode support (toggle in theme settings)
- 📱 Fully responsive design
- 🎯 Floating label inputs
- 💪 Real-time password strength indicator
- 🔄 Multi-step registration wizard
- ⏰ Session timeout warnings

### 🔒 Security Features
- 🎫 JWT token-based authentication
- 🔄 Automatic token refresh
- 💾 Secure token storage (localStorage/sessionStorage)
- 🚪 Protected routes with role-based access
- ⏱️ Session monitoring
- 🔐 Password strength validation

### 📱 Social Login (Ready for Integration)
- Google OAuth (UI ready, needs backend integration)
- Facebook OAuth (UI ready, needs backend integration)

## Using the Auth Hook

Access authentication features in any component:

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const {
    user,              // Current user object
    isAuthenticated,   // Boolean: is user logged in?
    isLoading,         // Boolean: is auth loading?
    error,             // String: auth error message
    login,             // Function: login user
    register,          // Function: register new user
    logout,            // Function: logout user
    refreshToken,      // Function: refresh access token
    updateUser,        // Function: update user data
    clearError,        // Function: clear error message
  } = useAuth();

  // Use these in your component...
}
```

## Mock API Responses

The system uses mock data for testing. All authentication actions will succeed with these test values:

### Test User
```json
{
  "id": "user_123",
  "email": "student@university.edu",
  "name": "John Doe",
  "role": "student",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
}
```

### Test Tokens
- **Access Token**: Valid for 24 hours
- **Refresh Token**: Valid for 7 days
- Tokens are automatically refreshed 5 minutes before expiry

## Next Steps

### Connect to Real Backend

1. Update API base URL in `src/services/auth.service.ts`:
```tsx
const api = axios.create({
  baseURL: 'https://your-backend-api.com/api',
});
```

2. Replace mock functions with actual API calls (see `AUTHENTICATION_GUIDE.md`)

### Add More Protected Pages

Create protected pages for different user roles:
- Student Dashboard
- Faculty Dashboard
- Admin Panel
- Course Management
- Profile Settings

### Enhance Features

Consider adding:
- Email verification on registration
- Two-factor authentication (2FA)
- Social login implementation
- Password change functionality
- Account settings page
- Login history/activity log

## Troubleshooting

### "Session Expired" on page load?
- Clear browser storage: `localStorage.clear()` in console
- Check token expiry times in the mock data

### Protected routes not working?
- Verify `AuthProvider` wraps the app in `App.tsx`
- Check console for authentication errors
- Ensure user is logged in before accessing protected routes

### Styles not loading?
- Verify Tailwind CSS is running: `npm start`
- Check `tailwind.config.js` exists
- Ensure `@tailwind` directives are in `src/index.css`

## Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm start

# Open in browser
# http://localhost:3000
```

## Documentation

For detailed documentation, see:
- **Full Guide**: `AUTHENTICATION_GUIDE.md`
- **Component Library**: `COMPONENT_LIBRARY.md`
- **Development Guide**: `DEVELOPMENT_GUIDE.md`

## Support

If you encounter any issues:
1. Check the console for errors
2. Review the `AUTHENTICATION_GUIDE.md`
3. Verify all files are created correctly
4. Test with mock data first before integrating with backend

---

**Built with:**
- React + TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form + Zod
- React Router DOM
- Axios
- React Hot Toast

**Ready to authenticate! 🎉**
