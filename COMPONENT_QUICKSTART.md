# Component Library Quick Reference

## Installation & Setup

All components are already installed and configured. No additional setup required!

## Quick Import

```tsx
import { 
  AnimatedButton, 
  CourseCard, 
  TextInput, 
  Modal,
  toast 
} from '@components/ui';
```

## Most Used Components

### Button
```tsx
<AnimatedButton variant="primary" onClick={handleClick}>
  Click Me
</AnimatedButton>
```

### Input
```tsx
<TextInput
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  fullWidth
/>
```

### Modal
```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Title">
  Content
</Modal>
```

### Toast
```tsx
toast.success('Success!');
toast.error('Error!');
```

### Card
```tsx
<CourseCard
  title="Course Name"
  code="CS101"
  instructor="Prof. Name"
  duration="10 weeks"
  students={50}
/>
```

## Demo Page

Visit `/components` to see all components with live examples.

## Full Documentation

See `COMPONENT_LIBRARY.md` for complete API documentation.

---

**Components Available:**
- Buttons (AnimatedButton)
- Cards (Course, Faculty, Stats, Event)
- Inputs (Text, Select, FileUpload, Checkbox, Radio)
- Modals (Modal, ConfirmModal, FormModal)
- Navigation (Navbar, Sidebar, Breadcrumbs, Tabs)
- Feedback (Skeleton, ProgressBar, Tooltip, Toast)

All components support:
✅ Dark mode
✅ Animations
✅ TypeScript
✅ Responsive design
✅ Accessibility
