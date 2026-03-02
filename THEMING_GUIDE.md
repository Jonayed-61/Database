# Theming System Guide

## 🎨 Complete Theming System Overview

Your University Management System now has a comprehensive theming system with dark/light mode support, custom colors, animations, and a flexible design system.

---

## 📁 Files Created

### 1. **tailwind.config.js**
Enhanced Tailwind configuration with:
- Custom color palette (Navy #0A1929, Gold #FFB347)
- Dark mode support (`class` strategy)
- Custom animations and keyframes
- Extended font families (Inter, Poppins)
- Custom shadows and gradients
- Responsive breakpoints

### 2. **src/index.css**
Global CSS with:
- CSS variables for theme colors
- Dark/light mode color schemes
- Google Fonts import
- Custom component classes (buttons, cards, badges)
- Animation utilities
- Glass morphism effects
- Custom scrollbar styling

### 3. **src/contexts/ThemeContext.tsx**
Theme context provider with:
- Dark/light mode toggle
- LocalStorage persistence
- System theme preference detection
- Type-safe theme hooks (`useTheme`, `useSystemTheme`)

### 4. **src/constants/theme.constants.ts**
Theme configuration constants:
- Color definitions
- Typography settings
- Spacing values
- Transitions
- Z-index levels
- Container sizes

### 5. **src/constants/animations.constants.ts**
Framer Motion animation variants:
- Fade animations (fadeIn, fadeOut)
- Slide animations (left, right, up, down)
- Scale animations
- Stagger animations
- Modal animations
- Hover effects
- Continuous animations (float, pulse, spin)

### 6. **src/components/common/ThemeToggle.tsx**
Animated theme toggle button with smooth transitions

### 7. **src/hooks/useAnimation.ts**
Custom animation hooks:
- `useScrollAnimation` - Trigger animations on scroll
- `useStaggerAnimation` - Stagger child animations
- `useIntersectionObserver` - Intersection observer
- `useMousePosition` - Track mouse position
- `useWindowSize` - Responsive window size
- `useReducedMotion` - Respect motion preferences

---

## 🚀 Usage Examples

### Using Theme Context

```tsx
import { useTheme } from '@contexts/ThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

### Using Animations

```tsx
import { motion } from 'framer-motion';
import { fadeInUpVariants, staggerContainerVariants } from '@constants/animations.constants';

function AnimatedList() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.div key={item.id} variants={fadeInUpVariants}>
          {item.name}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Using Tailwind Classes

```tsx
// Buttons
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>

// Cards
<div className="card">Basic Card</div>
<div className="card-hover">Hoverable Card</div>

// Badges
<span className="badge-primary">Primary</span>
<span className="badge-success">Success</span>

// Gradients
<div className="bg-university-gradient">Navy Gradient</div>
<div className="bg-gold-gradient">Gold Gradient</div>

// Animations
<div className="animate-fade-in">Fade In</div>
<div className="animate-slide-in-up">Slide Up</div>
<div className="animate-float">Floating</div>

// Glass Effect
<div className="glass">Light Glass</div>
<div className="glass-dark">Dark Glass</div>
```

### Using Theme Constants

```tsx
import { COLORS, TRANSITIONS, BREAKPOINTS } from '@constants/theme.constants';

const styles = {
  color: COLORS.NAVY[900],
  backgroundColor: COLORS.GOLD[500],
  transition: `all ${TRANSITIONS.BASE} ease-in-out`,
};
```

### Using Animation Hooks

```tsx
import { useScrollAnimation } from '@hooks/useAnimation';

function ScrollComponent() {
  const { ref, isInView } = useScrollAnimation();
  
  return (
    <div ref={ref}>
      {isInView ? 'Visible!' : 'Scroll to see me'}
    </div>
  );
}
```

---

## 🎨 Color Palette

### Navy (Primary Brand)
- `navy-900`: #0A1929 (Deep Blue - Main Brand)
- `navy-500`: #225ca0
- `navy-100`: #c2d1e4

### Gold (Secondary Brand)
- `gold-500`: #FFB347 (Gold - Accent)
- `gold-600`: #ff9f1a
- `gold-100`: #fff4d6

### Semantic Colors
- Success: `success-500` (#22c55e)
- Warning: `warning-500` (#f59e0b)
- Error: `error-500` (#ef4444)
- Info: `info-500` (#3b82f6)

---

## 🎬 Available Animations

### Tailwind Animations
- `animate-fade-in` / `animate-fade-out`
- `animate-slide-in-up` / `animate-slide-in-down`
- `animate-slide-in-left` / `animate-slide-in-right`
- `animate-scale-in`
- `animate-float`
- `animate-pulse-slow`
- `animate-spin-slow`
- `animate-wiggle`

### Framer Motion Variants
- `fadeInVariants`
- `fadeInUpVariants`
- `slideInLeftVariants`
- `scaleInVariants`
- `staggerContainerVariants`
- `cardHoverVariants`
- `buttonHoverVariants`
- `modalVariants`
- `pageTransitionVariants`
- And many more in `animations.constants.ts`

---

## 💡 Tips & Best Practices

### 1. Dark Mode
Always use CSS variables or Tailwind's dark mode variants:
```tsx
<div className="bg-white dark:bg-navy-900 text-navy-900 dark:text-white">
```

### 2. Animations
Use `useReducedMotion` hook to respect user preferences:
```tsx
const prefersReducedMotion = useReducedMotion();
const animation = prefersReducedMotion ? {} : fadeInVariants;
```

### 3. Responsive Design
Use Tailwind's responsive prefixes:
```tsx
<div className="text-base md:text-lg lg:text-xl">
```

### 4. Performance
- Use `will-change` for animated elements
- Prefer CSS animations over JS for simple transitions
- Use `transform` and `opacity` for better performance

### 5. Accessibility
- Include proper ARIA labels
- Use semantic HTML
- Ensure color contrast meets WCAG standards
- Test with keyboard navigation

---

## 🔧 Customization

### Adding New Colors
Edit `tailwind.config.js`:
```js
colors: {
  brand: {
    500: '#yourcolor',
  }
}
```

### Adding New Animations
Edit `tailwind.config.js`:
```js
animation: {
  'custom': 'customAnimation 1s ease-in-out',
},
keyframes: {
  customAnimation: {
    '0%': { /* ... */ },
    '100%': { /* ... */ },
  },
}
```

### Creating New Variants
Add to `src/constants/animations.constants.ts`:
```ts
export const myCustomVariants: Variants = {
  hidden: { /* ... */ },
  visible: { /* ... */ },
};
```

---

## 📱 Responsive Breakpoints

- **XS**: 0px (mobile)
- **SM**: 640px (mobile landscape)
- **MD**: 768px (tablet)
- **LG**: 1024px (desktop)
- **XL**: 1280px (large desktop)
- **2XL**: 1536px (extra large)

---

## 🎯 Theme Toggle Implementation

The theme toggle is available globally and can be placed anywhere:

```tsx
import { ThemeToggle } from '@components/common';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

---

## 🚨 Common Issues & Solutions

### Issue: Dark mode not working
**Solution**: Ensure ThemeProvider wraps your app in `App.tsx`

### Issue: Animations not smooth
**Solution**: Check if hardware acceleration is enabled, use `transform` properties

### Issue: Colors not updating
**Solution**: Restart dev server after changing `tailwind.config.js`

### Issue: CSS variables not working
**Solution**: Make sure you're using `var(--variable-name)` syntax

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Theme System Status:** ✅ Fully Configured and Ready to Use
