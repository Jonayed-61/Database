# Authentication System Documentation

## Overview

This authentication system provides a comprehensive solution including login, registration, password reset, and role-based access control. Built with React, TypeScript, and modern best practices.

## Features

### 🔐 Core Authentication
- **JWT-based Authentication**: Secure token-based authentication with refresh mechanism
- **Session Management**: Automatic session monitoring and token refresh
- **Session Timeout Warning**: Modal notification before session expiry
- **Remember Me**: Option to persist sessions across browser sessions
- **Social Login**: Integration points for Google and Facebook OAuth

### 📝 User Registration
- **Multi-Step Wizard**: 4-step registration process
  1. Account Information (email, password with strength indicator)
  2. Role Selection (Student, Faculty, Admin)
  3. Profile Picture Upload with preview
  4. Terms acceptance and verification notice
- **Password Strength Indicator**: Real-time password strength feedback
- **Form Validation**: Client-side validation using React Hook Form + Zod

### 🔑 Password Recovery
- **Forgot Password Flow**: 3-step password reset process
  1. Email submission
  2. 6-digit OTP verification
  3. New password setup
- **OTP Input**: User-friendly 6-digit code input with auto-focus
- **Success Animation**: Confirmation screen with redirect to login

### 🛡️ Access Control
- **Protected Routes**: Wrapper component for authenticated routes
- **Role-Based Access**: Restrict routes based on user roles
- **Access Denied Screen**: Friendly error page for unauthorized access

## File Structure

```
src/
├── types/
│   └── auth.types.ts           # TypeScript type definitions
├── utils/
│   └── auth.utils.ts           # Utility functions (token storage, validation)
├── services/
│   └── auth.service.ts         # API service layer (mock implementations)
├── contexts/
│   └── AuthContext.tsx         # Auth state management & useAuth hook
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx  # Route protection component
│       ├── SessionTimeout.tsx  # Session expiry warning modal
│       └── index.ts            # Barrel export
└── pages/
    └── auth/
        ├── LoginPage.tsx       # Login page with social auth
        ├── RegisterPage.tsx    # Multi-step registration
        └── ForgotPasswordPage.tsx  # Password recovery flow
```

## Usage Guide

### Setup

The authentication system is already integrated into your app. The `AuthProvider` wraps your entire application in `App.tsx`:

```tsx
<AuthProvider>
  {/* Your app content */}
</AuthProvider>
```

### Using the Auth Hook

Access authentication state and methods anywhere in your app:

```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Protecting Routes

#### Basic Protection (requires authentication):
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

#### Role-Based Protection:
```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

#### Public Routes (redirect if authenticated):
```tsx
<Route
  path="/login"
  element={
    <ProtectedRoute requireAuth={false}>
      <LoginPage />
    </ProtectedRoute>
  }
/>
```

## API Integration

### Current State: Mock API

The authentication service currently uses **mock implementations** with simulated delays. This allows you to develop and test the frontend without a backend.

### Connecting to Real API

To integrate with your backend API, update `src/services/auth.service.ts`:

1. **Update Base URL**:
```tsx
const api = axios.create({
  baseURL: 'https://your-api.com/api', // Change this
});
```

2. **Replace Mock Functions**:

Replace the mock implementations with real API calls:

```tsx
// Before (Mock)
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: mockUser,
        tokens: mockTokens,
      });
    }, 1000);
  });
};

// After (Real API)
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};
```

3. **Update All Endpoints**:
   - `loginUser` → POST `/auth/login`
   - `registerUser` → POST `/auth/register`
   - `requestPasswordReset` → POST `/auth/forgot-password`
   - `verifyOTP` → POST `/auth/verify-otp`
   - `resetPassword` → POST `/auth/reset-password`
   - `refreshAccessToken` → POST `/auth/refresh`
   - `logoutUser` → POST `/auth/logout`
   - `getCurrentUser` → GET `/auth/me`
   - `socialAuth` → POST `/auth/social/{provider}`

### Token Storage

Tokens are automatically stored based on "Remember Me" selection:
- **Remember Me checked**: `localStorage` (persists across sessions)
- **Remember Me unchecked**: `sessionStorage` (clears on browser close)

## Security Features

### Automatic Token Refresh
- Tokens are refreshed automatically 5 minutes before expiry
- Prevents session interruption for active users

### Session Monitoring
- Checks session validity every 60 seconds
- Shows warning modal when session is about to expire
- User can choose to continue or logout

### Password Security
- Minimum 8 characters required
- Real-time password strength indicator
- Strength calculated based on:
  - Length
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters

### Token Validation
- JWT tokens are validated on every request
- Expired tokens trigger automatic logout
- Refresh tokens used to maintain sessions

## Components Overview

### LoginPage
- Animated form with floating labels
- Social login buttons (Google, Facebook)
- Remember me checkbox
- Form validation with error messages
- Links to registration and password recovery

### RegisterPage
- 4-step registration wizard
- Step 1: Account info with password strength
- Step 2: Role selection (Student/Faculty/Admin)
- Step 3: Profile picture upload
- Step 4: Terms acceptance
- Progress indicator
- Step validation

### ForgotPasswordPage
- Email submission
- OTP verification (6-digit code)
- New password setup
- Success confirmation
- Automatic redirect to login

### ProtectedRoute
- Checks authentication status
- Validates user roles
- Shows loading state during auth check
- Displays access denied screen for unauthorized users
- Redirects unauthenticated users to login

### SessionTimeout
- Monitors token expiry
- Shows warning modal 5 minutes before expiry
- Countdown timer display
- Options to continue or logout
- Automatic logout on timeout

## TypeScript Types

### Key Types

```tsx
// User Role
type UserRole = 'student' | 'faculty' | 'admin';

// User Object
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Authentication Tokens
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

// Auth Context
interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}
```

## Testing with Mock Data

The mock API includes default users for testing:

```tsx
// Login with these credentials:
Email: student@university.edu
Password: password123

// Or create a new account via registration
```

## Customization

### Styling
All components use Tailwind CSS classes. Customize the appearance by modifying the classes in each component file.

### Animations
Animations are powered by Framer Motion. Adjust animation variants in component files:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

### Validation Rules
Form validation rules are defined using Zod schemas. Modify schemas in component files:

```tsx
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
```

## Troubleshooting

### Token Expiry Issues
If users are being logged out unexpectedly:
1. Check token expiry time in `auth.service.ts`
2. Adjust refresh timing in `AuthContext.tsx`
3. Verify token format matches JWT standard

### Session Timeout Not Showing
Ensure `SessionTimeout` component is rendered in `AppRoutes.tsx`:
```tsx
<Router>
  <SessionTimeout />
  <Routes>
    {/* Routes */}
  </Routes>
</Router>
```

### Protected Routes Not Working
Verify `AuthProvider` wraps your entire app in `App.tsx`:
```tsx
<AuthProvider>
  <AppRoutes />
</AuthProvider>
```

## Next Steps

### To Complete Backend Integration:
1. Update API base URL in `auth.service.ts`
2. Replace mock implementations with real API calls
3. Update response data structures to match your API
4. Add error handling for specific backend errors
5. Implement actual file upload for profile pictures

### Additional Features to Consider:
- [ ] Email verification on registration
- [ ] Two-factor authentication (2FA)
- [ ] Social login implementation (Google, Facebook, GitHub)
- [ ] Password change in user profile
- [ ] Account deletion
- [ ] Login history/activity log
- [ ] Remember devices
- [ ] Biometric authentication (Touch ID, Face ID)

## Support

For issues or questions about the authentication system:
1. Check this documentation
2. Review component code and comments
3. Test with mock data first
4. Verify API integration when connecting to backend

## License

This authentication system is part of your University Management System project.
