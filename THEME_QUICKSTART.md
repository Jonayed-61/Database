# 🎨 Theming System - Quick Start

## ✅ What's Been Created

Your university management website now has a **complete theming system** with:

### 1. **Custom Color Palette**
- **Navy** (Deep Blue #0A1929) - Primary brand color
- **Gold** (#FFB347) - Secondary accent color
- 10 shades for each color (50-950)
- Semantic colors (success, warning, error, info)

### 2. **Dark & Light Mode**
- Automatic theme toggle with smooth transitions
- LocalStorage persistence
- System theme preference detection
- CSS variables for dynamic theming

### 3. **Typography System**
- **Display Font**: Poppins (headings)
- **Body Font**: Inter (paragraphs)
- **Mono Font**: Monaco (code)
- Responsive font sizes

### 4. **Animation System**
Complete set of Framer Motion variants:
- Fade animations
- Slide animations  
- Scale animations
- Stagger animations
- Hover effects
- Continuous animations (float, pulse, wiggle)

### 5. **Custom Components**
- ThemeToggle button
- Pre-styled buttons (primary, secondary, outline)
- Card components with hover effects
- Badge components
- Input fields
- Glass morphism effects

---

## 🚀 Getting Started

### View the Demo
```bash
npm start
```
Then navigate to:
- **Homepage**: http://localhost:3000/
- **Theme Demo**: http://localhost:3000/demo

### Toggle Dark Mode
Click the theme toggle button in the top-right corner!

---

## 📁 Files Structure

```
src/
├── contexts/
│   ├── ThemeContext.tsx          # Theme provider & hooks
│   └── index.ts
├── constants/
│   ├── theme.constants.ts        # Color, font, spacing configs
│   └── animations.constants.ts   # Framer Motion variants
├── hooks/
│   └── useAnimation.ts           # Animation hooks
├── components/common/
│   └── ThemeToggle.tsx           # Theme toggle button
├── pages/
│   ├── HomePage.tsx              # Updated with theming
│   └── ThemeDemo.tsx             # Complete demo page
├── index.css                     # Global styles with CSS variables
└── tailwind.config.js            # Tailwind configuration
```

---

## 💡 Quick Usage Examples

### 1. Use Theme Context
```tsx
import { useTheme } from '@contexts/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle</button>;
}
```

### 2. Apply Theme Colors
```tsx
// Navy colors
<div className="bg-navy-900 text-white" />
<div className="bg-navy-500" />

// Gold colors
<div className="bg-gold-500" />
<div className="text-gold-600" />

// With dark mode
<div className="bg-white dark:bg-navy-900" />
```

### 3. Use Animations
```tsx
import { motion } from 'framer-motion';
import { fadeInUpVariants } from '@constants/animations.constants';

<motion.div
  variants={fadeInUpVariants}
  initial="hidden"
  animate="visible"
>
  Animated Content
</motion.div>
```

### 4. Pre-styled Components
```tsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>

<div className="card">Card Content</div>
<div className="card-hover">Hoverable Card</div>

<span className="badge-primary">Badge</span>
<span className="badge-success">Success</span>
```

### 5. Gradients
```tsx
<div className="bg-university-gradient">Navy Gradient</div>
<div className="bg-gold-gradient">Gold Gradient</div>

<h1 className="gradient-text">Gradient Text</h1>
<h1 className="gradient-text-gold">Gold Text</h1>
```

### 6. Glass Effects
```tsx
<div className="glass">Light Glass</div>
<div className="glass-dark">Dark Glass</div>
```

### 7. Animations
```tsx
<div className="animate-fade-in">Fade In</div>
<div className="animate-slide-in-up">Slide Up</div>
<div className="animate-float">Float</div>
<div className="hover-lift">Lift on Hover</div>
```

---

## 🎨 Color Reference

### Navy (Primary)
```
navy-50   #e8edf5  (lightest)
navy-100  #c2d1e4
navy-500  #225ca0
navy-900  #0A1929  (brand color)
navy-950  #050c15  (darkest)
```

### Gold (Secondary)
```
gold-50   #fffbf0  (lightest)
gold-100  #fff4d6
gold-500  #FFB347  (brand color)
gold-900  #8f4f00
gold-950  #5c3300  (darkest)
```

---

## 🎬 Animation Reference

### Tailwind Classes
- `animate-fade-in`
- `animate-slide-in-up` / `-down` / `-left` / `-right`
- `animate-scale-in`
- `animate-float`
- `animate-pulse-slow`
- `animate-spin-slow`
- `animate-wiggle`

### Framer Motion Variants
- `fadeInVariants`
- `fadeInUpVariants`
- `slideInLeftVariants` / `slideInRightVariants`
- `scaleInVariants`
- `staggerContainerVariants` + `staggerItemVariants`
- `cardHoverVariants`
- `buttonHoverVariants`
- `modalVariants`
- `floatingVariants`
- `pulseVariants`

---

## 📱 Responsive Design

All components are responsive by default:

```tsx
// Responsive text
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

Breakpoints:
- **SM**: 640px
- **MD**: 768px  
- **LG**: 1024px
- **XL**: 1280px
- **2XL**: 1536px

---

## 🌙 Dark Mode

Dark mode is automatically handled. Use Tailwind's `dark:` prefix:

```tsx
<div className="
  bg-white dark:bg-navy-900
  text-navy-900 dark:text-white
  border-gray-200 dark:border-navy-700
">
  Adapts to theme
</div>
```

CSS Variables (automatically switch):
```css
background: var(--color-bg-primary);
color: var(--color-text-primary);
border: 1px solid var(--color-border);
```

---

## 🎯 Next Steps

1. **Explore the demo page**: Visit `/demo` to see all features
2. **Customize colors**: Edit `tailwind.config.js`
3. **Add your pages**: Use the theming system in your components
4. **Create custom variants**: Add to `animations.constants.ts`
5. **Extend components**: Build on the base styles in `index.css`

---

## 📚 Documentation

- [Complete Theming Guide](./THEMING_GUIDE.md) - Full documentation
- [Tailwind Config](./tailwind.config.js) - Theme configuration
- [Global Styles](./src/index.css) - CSS classes & variables
- [Animation Variants](./src/constants/animations.constants.ts) - All animations

---

## 🎉 Ready to Build!

Your theming system is **fully configured** and ready to use. Every component automatically supports:
✅ Dark/Light mode
✅ Smooth animations  
✅ Responsive design
✅ Consistent styling
✅ Accessibility

**Start building amazing UI with your new theming system!** 🚀

---

**Questions?** Check the [THEMING_GUIDE.md](./THEMING_GUIDE.md) for detailed usage examples.
