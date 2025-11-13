# QuickStay Color Scheme & Typography Guide

## Overview
Each page has been carefully designed with a unique color palette and typography to create a cohesive yet distinctive visual experience throughout the website.

---

## 🎨 Page-Specific Color Schemes

### 1. **My Bookings Page** - Warm Amber/Orange Theme
**Color Palette:**
- Primary: Amber (500-600) / Orange (500-600)
- Accents: Rose, Warm tones
- Background: Amber-50 to Rose-50 gradient

**Typography:**
- Headings: Bold, Sans-serif with gradient text
- Body: Medium weight, readable spacing
- Icons: Amber/Orange tones with subtle glow effects

**Design Elements:**
- Warm gradient backgrounds (amber → orange → rose)
- Booking cards with semi-transparent white backgrounds
- Amber-tinted glow orbs for ambient lighting
- Status badges with color-coded states (yellow/green/red)
- Hover effects with scale transformations

**User Experience:**
- Conveys warmth and trust for booking management
- Orange creates urgency for pending actions
- Clear visual hierarchy with card-based layouts

---

### 2. **Room Details Page** - Luxurious Cyan/Teal/Blue Theme
**Color Palette:**
- Primary: Cyan (600-700) / Teal (600-700) / Deep Blue (600-700)
- Accents: Light blue, Aqua tones
- Background: Cyan-50 to Teal-50 gradient

**Typography:**
- Headings: Playfair Display (serif) with gradient effects
- Price: Bold, extra-large with gradient
- Body: Light weight, elegant spacing
- Labels: Medium weight with icon pairings

**Design Elements:**
- Luxury deep blue/teal gradient backgrounds
- High-quality image galleries with hover zoom effects
- Glass-morphism effects (backdrop-blur) on info cards
- Cyan-tinted decorative orbs
- Premium amenity badges with borders
- Ring effects on selected images

**User Experience:**
- Evokes luxury, trust, and sophistication
- Blue/teal creates calming, premium feel
- Visual emphasis on high-value content (images, prices)

---

### 3. **About Page** - Sophisticated Purple/Violet/Fuchsia Theme
**Color Palette:**
- Primary: Purple (600) / Violet (600) / Fuchsia (600)
- Accents: Light purple, Magenta tones
- Background: Purple-50 to Fuchsia-50 gradient

**Typography:**
- Hero Headings: Playfair Display, extra-bold with drop shadows
- Subheadings: Gradient text with serif fonts
- Body: Light weight, increased line-height for readability
- Stats: Extra-large, bold Playfair with dramatic sizing

**Design Elements:**
- Bold purple gradient hero banner
- Animated background orbs in multiple layers
- Story section with individual card backgrounds
- Glass-morphism panels for text content
- Stats section with semi-transparent cards
- Team cards with hover effects
- Multiple decorative blur orbs

**User Experience:**
- Purple conveys creativity, innovation, and premium brand
- Gradient variations add depth and visual interest
- Clear information hierarchy with spaced sections

---

### 4. **Hotel Rooms (Listing) Page** - Vibrant Pink/Purple/Indigo Theme
**Color Palette:**
- Primary: Pink (400-600) / Purple (400-600) / Blue (400-600)
- Accents: Indigo, Violet tones
- Background: Pink-50 to Blue-50 gradient

**Design Elements:**
- Animated gradient orbs (pink, purple, blue)
- Filter panel with gradient background and glow effects
- Glassmorphism filter cards with rounded corners
- Room cards with hover animations
- Gradient buttons with shadow effects
- Colored indicator dots for filter sections

**User Experience:**
- Vibrant colors create excitement for exploration
- Filters are visually distinct and easy to use
- Playful yet professional aesthetic

---

### 5. **Hero Section (Home)** - Deep Indigo/Violet/Pink Theme
**Color Palette:**
- Primary: Indigo (500-600) / Violet (500-600) / Pink (500-600)
- Background: Heroic image with gradient overlays

**Typography:**
- Main Heading: Playfair Display, bold with text-shadow
- Subtext: Light weight with good contrast
- CTA buttons: Bold with gradient backgrounds

**Design Elements:**
- Dramatic gradient overlay on hero image
- Floating badge with backdrop-blur
- Large animated gradient orbs
- Text shadows for legibility
- Gradient CTA elements

**User Experience:**
- Creates immediate visual impact
- Establishes brand identity with bold colors
- Drives user attention to search functionality

---

## 🎯 Design Principles Applied

### 1. **Color Psychology**
- **Warm tones (Amber/Orange)**: Trust, urgency, action (Bookings)
- **Cool tones (Cyan/Teal)**: Luxury, calm, premium (Room Details)
- **Purple/Violet**: Creativity, sophistication (About)
- **Multi-gradient**: Energy, excitement (Listings, Hero)

### 2. **Typography Hierarchy**
- **Serif fonts (Playfair Display)**: Used for headings to convey elegance
- **Sans-serif fonts**: Used for body text for readability
- **Font sizes**: Clear hierarchy (5xl+ for heroes, 2xl-3xl for sections, base for body)
- **Font weights**: Bold for CTAs, medium for labels, light for body

### 3. **Visual Effects**
- **Backdrop blur (glass-morphism)**: Creates depth and modern aesthetic
- **Gradient text**: Adds visual interest to headings
- **Animated orbs**: Ambient lighting and movement
- **Hover animations**: Scale, shadow, and color transitions
- **Shadows**: Multiple layers for depth (text-shadow, box-shadow)

### 4. **Accessibility**
- High contrast ratios maintained
- Dark mode support with adjusted opacity and colors
- Focus states on interactive elements
- Semantic color usage (green=success, red=danger, yellow=warning)

### 5. **Consistency**
- Similar component patterns across pages (cards, buttons, badges)
- Consistent spacing and padding
- Unified animation durations and easing
- Shared utility classes

---

## 🌓 Dark Mode Support

Each page maintains its color scheme in dark mode with:
- Reduced opacity on bright colors
- Darker background variations
- Inverted text for contrast
- Adjusted border colors
- Maintained gradient themes with darker tones

---

## 🎨 Color Combinations Quick Reference

### Booking Page
```css
from-amber-500 to-orange-500  /* Buttons, active states */
from-amber-50 to-rose-50      /* Page background */
bg-amber-100 to orange-100    /* Card backgrounds */
```

### Room Details
```css
from-cyan-700 to-teal-700     /* Headings */
from-cyan-50 to-teal-50       /* Page background */
from-cyan-600 to-teal-600     /* Price, CTAs */
```

### About Page
```css
from-purple-600 to-fuchsia-600 /* Hero, stats banner */
from-purple-50 to-fuchsia-50   /* Page background */
from-purple-700 to-fuchsia-700 /* Headings */
```

### Hotel Rooms
```css
from-pink-400 to-purple-400    /* Orbs */
from-pink-50 to-blue-50        /* Page background */
from-indigo-500 to-violet-500  /* Filter panel */
```

---

## 📊 Typography Scale

```css
/* Heroes & Main Titles */
text-5xl md:text-7xl (48px-72px)

/* Section Headings */
text-3xl md:text-5xl (30px-48px)

/* Subheadings */
text-2xl md:text-4xl (24px-36px)

/* Body Large */
text-lg (18px)

/* Body Regular */
text-base (16px)

/* Small Text */
text-sm (14px)

/* Extra Small */
text-xs (12px)
```

---

## 🎯 Implementation Best Practices

1. **Use Gradient Text Sparingly**: Reserve for headlines and key elements
2. **Layer Backgrounds**: Use multiple semi-transparent layers for depth
3. **Animate Thoughtfully**: Keep animations subtle and purposeful
4. **Test Contrast**: Ensure text is readable on all backgrounds
5. **Maintain Brand**: Keep color themes within the established palette
6. **Responsive Design**: Adjust text sizes and spacing for mobile
7. **Performance**: Use CSS gradients over images when possible

---

## 🚀 Future Enhancements

Consider adding:
- Seasonal color themes
- User-customizable accent colors
- More granular dark mode controls
- Color-blind friendly mode
- Print-optimized styles
- Animation preferences (reduced motion)

---

## 📝 Notes

- All colors are Tailwind CSS compatible
- Gradients use the `bg-gradient-to-*` utilities
- Dark mode uses `dark:` variant prefix
- Custom animations are defined in global CSS
- Backdrop blur requires backdrop-filter support

---

**Last Updated**: November 11, 2025  
**Designer**: AI Design System  
**Framework**: Tailwind CSS v3+
