# UI Component Library Documentation

## Overview

This comprehensive UI component library provides a complete set of reusable, animated components for the University Management System. All components are built with React, TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## Table of Contents

1. [Button Components](#button-components)
2. [Card Components](#card-components)
3. [Input Components](#input-components)
4. [Modal Components](#modal-components)
5. [Navigation Components](#navigation-components)
6. [Feedback Components](#feedback-components)

---

## Button Components

### AnimatedButton

A versatile button component with animations, loading states, and ripple effects.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `isLoading`: boolean (default: false)
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode
- `fullWidth`: boolean (default: false)
- All standard HTML button attributes

**Usage:**
```tsx
import { AnimatedButton } from '@components/ui';

<AnimatedButton variant="primary" onClick={handleClick}>
  Click Me
</AnimatedButton>

<AnimatedButton 
  variant="secondary" 
  isLoading={loading}
  leftIcon={<Icon />}
>
  Submit
</AnimatedButton>
```

---

## Card Components

### CourseCard

Displays course information with hover animations.

**Props:**
- `title`: string
- `code`: string
- `instructor`: string
- `duration`: string
- `students`: number
- `image?`: string
- `level?`: 'Beginner' | 'Intermediate' | 'Advanced'
- `onClick?`: () => void

**Usage:**
```tsx
import { CourseCard } from '@components/ui';

<CourseCard
  title="Introduction to Computer Science"
  code="CS101"
  instructor="Dr. John Smith"
  duration="12 weeks"
  students={150}
  level="Beginner"
  onClick={() => navigate('/course/cs101')}
/>
```

### FacultyCard

Displays faculty member information with image reveal animation.

**Props:**
- `name`: string
- `designation`: string
- `department`: string
- `email`: string
- `phone?`: string
- `image?`: string
- `specialization?`: string[]
- `onClick?`: () => void

### StatsCard

Displays statistics with counting animation.

**Props:**
- `title`: string
- `value`: number
- `suffix?`: string (e.g., '%', 'K')
- `prefix?`: string (e.g., '$')
- `icon?`: React.ReactNode
- `trend?`: { value: number; isPositive: boolean }
- `color?`: 'navy' | 'gold' | 'success' | 'warning' | 'error'

### EventCard

Displays event information with date badge.

**Props:**
- `title`: string
- `description`: string
- `date`: Date
- `location`: string
- `category`: string
- `attendees?`: number
- `image?`: string
- `status?`: 'upcoming' | 'ongoing' | 'completed'
- `onClick?`: () => void

---

## Input Components

### TextInput

A text input with floating label animation.

**Props:**
- `label`: string
- `error?`: string
- `helperText?`: string
- `leftIcon?`: React.ReactNode
- `rightIcon?`: React.ReactNode
- `fullWidth?`: boolean
- `variant?`: 'outlined' | 'filled'
- `inputSize?`: 'sm' | 'md' | 'lg'
- All standard HTML input attributes

**Usage:**
```tsx
import { TextInput } from '@components/ui';

<TextInput
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
  fullWidth
/>
```

### Select

A custom select component with optional search functionality.

**Props:**
- `label`: string
- `options`: Array<{ value: string; label: string }>
- `error?`: string
- `helperText?`: string
- `fullWidth?`: boolean
- `selectSize?`: 'sm' | 'md' | 'lg'
- `searchable?`: boolean

**Usage:**
```tsx
import { Select } from '@components/ui';

<Select
  label="Select Country"
  options={countries}
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
  searchable
  fullWidth
/>
```

### FileUpload

A file upload component with drag-and-drop support.

**Props:**
- `label`: string
- `accept?`: string
- `multiple?`: boolean
- `maxSize?`: number (in MB)
- `onChange?`: (files: File[]) => void
- `error?`: string
- `helperText?`: string
- `disabled?`: boolean

**Usage:**
```tsx
import { FileUpload } from '@components/ui';

<FileUpload
  label="Upload Documents"
  accept=".pdf,.doc,.docx"
  multiple
  maxSize={10}
  onChange={(files) => handleFileUpload(files)}
/>
```

### Checkbox

An animated checkbox component.

**Props:**
- `label`: string
- `description?`: string
- `error?`: string
- `checkboxSize?`: 'sm' | 'md' | 'lg'

**Usage:**
```tsx
import { Checkbox } from '@components/ui';

<Checkbox
  label="Remember me"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>
```

### RadioGroup

A group of radio buttons.

**Props:**
- `label`: string
- `options`: Array<{ value: string; label: string; description?: string }>
- `name`: string
- `error?`: string
- `orientation?`: 'horizontal' | 'vertical'
- `radioSize?`: 'sm' | 'md' | 'lg'
- `value?`: string
- `onChange?`: (value: string) => void

**Usage:**
```tsx
import { RadioGroup } from '@components/ui';

<RadioGroup
  label="Select Payment Method"
  name="payment"
  options={paymentOptions}
  value={selectedPayment}
  onChange={setSelectedPayment}
/>
```

---

## Modal Components

### Modal

A base modal component with backdrop and animations.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title?`: string
- `children`: React.ReactNode
- `size?`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton?`: boolean (default: true)
- `closeOnBackdropClick?`: boolean (default: true)
- `closeOnEscape?`: boolean (default: true)

**Usage:**
```tsx
import { Modal } from '@components/ui';

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
  title="Example Modal"
>
  <p>Modal content goes here</p>
</Modal>
```

### ConfirmModal

A confirmation dialog modal.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `onConfirm`: () => void
- `title`: string
- `message`: string
- `confirmText?`: string (default: 'Confirm')
- `cancelText?`: string (default: 'Cancel')
- `variant?`: 'danger' | 'warning' | 'info' (default: 'danger')
- `isLoading?`: boolean

**Usage:**
```tsx
import { ConfirmModal } from '@components/ui';

<ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  variant="danger"
/>
```

### FormModal

A modal for forms with submit/cancel actions.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `onSubmit`: (e: React.FormEvent) => void
- `title`: string
- `children`: React.ReactNode
- `submitText?`: string (default: 'Submit')
- `cancelText?`: string (default: 'Cancel')
- `isLoading?`: boolean
- `size?`: 'sm' | 'md' | 'lg' | 'xl'

**Usage:**
```tsx
import { FormModal, TextInput } from '@components/ui';

<FormModal
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  onSubmit={handleSubmit}
  title="Add New User"
  isLoading={isSubmitting}
>
  <TextInput label="Name" required fullWidth />
  <TextInput label="Email" type="email" required fullWidth />
</FormModal>
```

---

## Navigation Components

### Navbar

A responsive navigation bar with scroll behavior.

**Props:**
- `logo?`: React.ReactNode
- `items`: Array<{ label: string; href: string; icon?: React.ReactNode }>
- `rightContent?`: React.ReactNode
- `hideOnScroll?`: boolean (default: false)

**Usage:**
```tsx
import { Navbar } from '@components/ui';

<Navbar
  items={[
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'About', href: '/about' }
  ]}
  rightContent={<ThemeToggle />}
  hideOnScroll
/>
```

### Sidebar

A collapsible sidebar with nested menu items.

**Props:**
- `items`: Array<{ label: string; icon: React.ReactNode; href?: string; children?: MenuItem[] }>
- `isCollapsed?`: boolean
- `onToggle?`: () => void

**Usage:**
```tsx
import { Sidebar } from '@components/ui';

<Sidebar
  items={menuItems}
  isCollapsed={collapsed}
  onToggle={() => setCollapsed(!collapsed)}
/>
```

### Breadcrumbs

Navigation breadcrumbs.

**Props:**
- `items`: Array<{ label: string; href?: string; icon?: React.ReactNode }>
- `separator?`: React.ReactNode

**Usage:**
```tsx
import { Breadcrumbs } from '@components/ui';

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'CS101' }
  ]}
/>
```

### Tabs

Tabbed navigation with content panels.

**Props:**
- `tabs`: Array<{ id: string; label: string; icon?: React.ReactNode; content: React.ReactNode; disabled?: boolean }>
- `defaultTab?`: string
- `onChange?`: (tabId: string) => void
- `variant?`: 'underline' | 'pills' | 'bordered' (default: 'underline')

**Usage:**
```tsx
import { Tabs } from '@components/ui';

<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', content: <Overview /> },
    { id: 'details', label: 'Details', content: <Details /> }
  ]}
  defaultTab="overview"
  onChange={(tab) => console.log(tab)}
/>
```

---

## Feedback Components

### Skeleton

Loading placeholders with animations.

**Props:**
- `variant?`: 'text' | 'circular' | 'rectangular' | 'rounded'
- `width?`: string | number
- `height?`: string | number
- `className?`: string
- `animation?`: 'pulse' | 'wave' | 'none'

**Additional Components:**
- `CardSkeleton`: Pre-built card skeleton
- `ListSkeleton`: Pre-built list skeleton
- `TableSkeleton`: Pre-built table skeleton

**Usage:**
```tsx
import { Skeleton, CardSkeleton, ListSkeleton } from '@components/ui';

// Custom skeleton
<Skeleton variant="text" width="200px" />

// Pre-built skeletons
<CardSkeleton />
<ListSkeleton items={5} />
```

### ProgressBar

Linear and circular progress indicators.

**Props (Linear):**
- `value`: number
- `max?`: number (default: 100)
- `size?`: 'sm' | 'md' | 'lg'
- `variant?`: 'default' | 'success' | 'warning' | 'error' | 'info'
- `showLabel?`: boolean
- `label?`: string
- `animated?`: boolean
- `striped?`: boolean

**Props (Circular):**
- `value`: number
- `max?`: number
- `size?`: number
- `strokeWidth?`: number
- `variant?`: 'default' | 'success' | 'warning' | 'error' | 'info'
- `showLabel?`: boolean
- `label?`: string

**Usage:**
```tsx
import { ProgressBar, CircularProgress } from '@components/ui';

<ProgressBar value={75} showLabel label="Upload Progress" />

<CircularProgress value={80} label="Completion" />
```

### Tooltip

Hover tooltips with positioning.

**Props:**
- `content`: React.ReactNode
- `children`: React.ReactNode
- `position?`: 'top' | 'bottom' | 'left' | 'right' (default: 'top')
- `delay?`: number (default: 200)
- `className?`: string

**Usage:**
```tsx
import { Tooltip } from '@components/ui';

<Tooltip content="This is a helpful tip" position="top">
  <button>Hover me</button>
</Tooltip>
```

### Toast

Notification system with custom styling.

**Methods:**
- `toast.success(message, options?)`
- `toast.error(message, options?)`
- `toast.warning(message, options?)`
- `toast.info(message, options?)`
- `toast.loading(message, options?)`
- `toast.promise(promise, messages, options?)`
- `toast.dismiss(toastId?)`

**Setup:**
Add `ToastProvider` to your app root:

```tsx
import { ToastProvider } from '@components/ui';

function App() {
  return (
    <>
      <YourApp />
      <ToastProvider />
    </>
  );
}
```

**Usage:**
```tsx
import { toast } from '@components/ui';

// Simple notifications
toast.success('Operation successful!');
toast.error('Something went wrong!');
toast.warning('Please be careful!');
toast.info('Here is some information.');

// With loading state
const toastId = toast.loading('Processing...');
// Later...
toast.dismiss(toastId);

// With promises
toast.promise(
  fetchData(),
  {
    loading: 'Fetching data...',
    success: 'Data loaded!',
    error: 'Failed to load data.'
  }
);
```

---

## Component Showcase

Visit `/components` route to see all components in action with interactive examples.

## Import Patterns

```tsx
// Import individual components
import { AnimatedButton, TextInput, Modal } from '@components/ui';

// Or import from specific files
import AnimatedButton from '@components/ui/AnimatedButton';
import TextInput from '@components/ui/TextInput';
```

## Styling

All components use Tailwind CSS classes and support dark mode through the theme context. Components automatically adapt to the current theme.

## Animation

Components use Framer Motion for smooth animations. Most components have built-in hover, tap, and entrance animations.

## Accessibility

- All interactive components support keyboard navigation
- Form inputs have proper labels and ARIA attributes
- Modal components trap focus and support ESC key
- Color contrast meets WCAG AA standards

---

For more examples and implementation details, check the source code in `src/components/ui/` or visit the `/components` demo page.
