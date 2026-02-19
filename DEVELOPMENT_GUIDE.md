# Development Guide - Quick Reference

## 🎯 Common Development Patterns

### 1. Creating a New Page

```typescript
// src/pages/StudentsPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '@components/common';

const StudentsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Students</h1>
      <Card>
        <p>Student content here</p>
      </Card>
    </motion.div>
  );
};

export default StudentsPage;
```

Then add route in `src/routes/AppRoutes.tsx`:
```typescript
import StudentsPage from '@pages/StudentsPage';

<Route path="/students" element={<StudentsPage />} />
```

### 2. Creating a Redux Slice

```typescript
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@types/index';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
```

Add to store:
```typescript
// src/store/store.ts
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
```

### 3. Using React Query for Data Fetching

```typescript
// src/services/student.service.ts
import { apiService } from './api.service';
import { Student, ApiResponse } from '@types/index';

export const studentService = {
  getAll: () => apiService.get<ApiResponse<Student[]>>('/students'),
  getById: (id: string) => apiService.get<ApiResponse<Student>>(`/students/${id}`),
  create: (data: Partial<Student>) => apiService.post<ApiResponse<Student>>('/students', data),
  update: (id: string, data: Partial<Student>) => apiService.put<ApiResponse<Student>>(`/students/${id}`, data),
  delete: (id: string) => apiService.delete<ApiResponse<void>>(`/students/${id}`),
};
```

```typescript
// src/pages/StudentsPage.tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { studentService } from '@services/student.service';
import { queryClient } from '@services/queryClient';
import toast from 'react-hot-toast';

const StudentsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete student');
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading students</div>;

  return (
    <div>
      {data?.data.map(student => (
        <div key={student.id}>
          {student.firstName} {student.lastName}
          <Button onClick={() => deleteMutation.mutate(student.id)}>
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};
```

### 4. Creating a Form with Validation

```typescript
// src/pages/AddStudentPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, StudentFormData } from '@utils/validations';
import { Input, Button } from '@components/common';
import toast from 'react-hot-toast';

const AddStudentPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = async (data: StudentFormData) => {
    try {
      await studentService.create(data);
      toast.success('Student added successfully');
    } catch (error) {
      toast.error('Failed to add student');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="First Name"
        {...register('firstName')}
        error={errors.firstName?.message}
      />
      <Input
        label="Last Name"
        {...register('lastName')}
        error={errors.lastName?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Add Student
      </Button>
    </form>
  );
};
```

### 5. Using Custom Hooks

```typescript
// src/hooks/useAuth.ts
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { setUser, logout } from '@store/slices/authSlice';
import { storageService } from '@utils/storage';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const login = (userData: User, token: string) => {
    dispatch(setUser(userData));
    storageService.setAuthToken(token);
    storageService.setUserData(userData);
  };

  const logoutUser = () => {
    dispatch(logout());
    storageService.removeAuthToken();
    storageService.removeUserData();
  };

  return { user, isAuthenticated, login, logoutUser };
};
```

Usage:
```typescript
const { user, isAuthenticated, login, logoutUser } = useAuth();
```

### 6. Creating Protected Routes

```typescript
// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

Usage in routes:
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### 7. Working with Local Storage

```typescript
import { storageService } from '@utils/storage';

// Save data
storageService.setItem('theme', 'dark');
storageService.setAuthToken('your-token');
storageService.setUserData(userData);

// Get data
const theme = storageService.getItem<string>('theme');
const token = storageService.getAuthToken();
const user = storageService.getUserData<User>();

// Remove data
storageService.removeItem('theme');
storageService.removeAuthToken();

// Clear all
storageService.clear();
```

### 8. Using Absolute Imports

```typescript
// ✅ Good - Use absolute imports
import Button from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';
import { API_BASE_URL } from '@constants/app.constants';
import { Student } from '@types/index';
import { formatDate } from '@utils/helpers';

// ❌ Avoid - Relative imports for cross-folder references
import Button from '../../../components/common/Button';
```

### 9. Tailwind CSS Patterns

```tsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Custom colors from theme
<button className="bg-primary-600 hover:bg-primary-700 text-white">

// Animation with Tailwind
<div className="transition-all duration-300 hover:scale-105">

// Flexbox centering
<div className="flex items-center justify-center min-h-screen">

// Custom shadow from config
<Card className="shadow-soft">
```

### 10. Environment Variables

```typescript
// Access environment variables
const apiUrl = process.env.REACT_APP_API_BASE_URL;
const isDebug = process.env.REACT_APP_ENABLE_DEBUG === 'true';

// Always prefix with REACT_APP_
// Example .env.local:
// REACT_APP_API_BASE_URL=http://localhost:5000/api
// REACT_APP_ENABLE_DEBUG=true
```

## 🎨 Component Styling Guide

### Primary Button
```tsx
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

### Secondary Button
```tsx
<Button variant="secondary" size="lg">
  Large Button
</Button>
```

### Outline Button
```tsx
<Button variant="outline" size="sm">
  Small Outline
</Button>
```

### Loading Button
```tsx
<Button isLoading={isSubmitting}>
  Submit
</Button>
```

### Animated Card
```tsx
<Card hoverable onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

## 🔥 Pro Tips

1. **Always use TypeScript types** - Avoid `any` type
2. **Use absolute imports** - Makes refactoring easier
3. **Keep components small** - Single responsibility principle
4. **Use React Query for server state** - Don't store API data in Redux
5. **Use Redux for client state** - Like UI state, auth state, etc.
6. **Validate all forms with Zod** - Type-safe validation
7. **Use Framer Motion sparingly** - Only for key animations
8. **Follow the folder structure** - Consistency matters
9. **Write reusable components** - DRY principle
10. **Test your API calls** - Use tools like Postman first

## 📚 Useful Commands

```bash
# Start development
npm start

# Format all files
npm run format

# Fix linting issues
npm run lint:fix

# Build for production
npm run build

# Run tests
npm test

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## 🐛 Common Issues & Solutions

### Issue: Absolute imports not working
**Solution:** Restart your IDE/VS Code after updating tsconfig.json

### Issue: Tailwind classes not applying
**Solution:** Make sure file path is in `tailwind.config.js` content array

### Issue: Environment variables undefined
**Solution:** Restart dev server after changing .env files

### Issue: API calls failing with CORS
**Solution:** Configure CORS on your backend server

### Issue: Type errors with motion components
**Solution:** Use `HTMLMotionProps<'element'>` for proper typing

---

**Happy Coding! 🚀**
