# 📱 Mobile Responsive Quick Reference

## Responsive Classes Pattern

```
Class Pattern: property-value sm:property-value md:property-value lg:property-value
```

### Common Responsive Classes

#### Padding
```tsx
p-3 sm:p-4 md:p-6 lg:p-8              // Padding scales: 12px → 16px → 24px → 32px
px-3 sm:px-4 md:px-6                  // Horizontal padding only
py-2 sm:py-3 md:py-4                  // Vertical padding only
```

#### Text Sizing
```tsx
text-sm sm:text-base md:text-lg        // 14px → 16px → 18px
text-xl sm:text-2xl md:text-3xl        // 20px → 24px → 30px
```

#### Grid Layouts
```tsx
grid-cols-1 sm:grid-cols-2             // 1 column mobile, 2 on tablet+
grid-cols-1 sm:grid-cols-2 md:grid-cols-3  // 1 → 2 → 3 columns
```

#### Heights
```tsx
h-10 sm:h-11 md:h-12                   // 40px → 44px → 48px (buttons/inputs)
h-14 md:h-16                           // 56px → 64px (header)
```

#### Gaps & Spacing
```tsx
gap-2 sm:gap-3 md:gap-4                // Spacing: 8px → 12px → 16px
space-y-3 sm:space-y-4 md:space-y-6    // Vertical spacing
```

## Component Examples

### Responsive Header
```tsx
<header className="sticky top-0 z-40 flex h-14 md:h-16 items-center 
         justify-between border-b border-border bg-card px-3 md:px-6">
  {/* Content */}
</header>
```

### Responsive Form
```tsx
<form className="space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input className="h-10 sm:h-11 md:h-12 text-sm p-2" />
    <input className="h-10 sm:h-11 md:h-12 text-sm p-2" />
  </div>
</form>
```

### Responsive Button
```tsx
<button className="px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-3 
         h-10 sm:h-11 md:h-12 text-sm sm:text-base">
  Action
</button>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
    lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>
```

## Breakpoint Reference

```
Screen Size           Breakpoint  Use
─────────────────────────────────────────────
320-639px (mobile)    (default)   Phones
640-767px (tablet)    sm:         Small tablets
768-1023px (tablet)   md:         Tablets
1024px+ (desktop)     lg:         Desktops
```

## Touch-Friendly Sizing

```
Button:      minimum 44x44px
Link:        minimum 44x44px  
Input:       minimum 44px height
Spacing:     8px minimum between elements
Font:        16px on inputs (prevents iOS zoom)
```

## Hide/Show Based on Screen Size

```tsx
// Hide on mobile, show on tablet+
<div className="hidden sm:block">Content</div>

// Show on mobile, hide on tablet+
<div className="sm:hidden">Mobile Menu</div>

// Show only on specific size
<div className="hidden md:block lg:hidden">Tablet View</div>
```

## Responsive Font Examples

```tsx
// Large heading
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"

// Page title
className="text-xl sm:text-2xl md:text-3xl font-bold"

// Section title
className="text-lg sm:text-xl md:text-2xl font-semibold"

// Body text
className="text-sm sm:text-base md:text-lg"

// Small text
className="text-xs sm:text-sm md:text-base"
```

## Responsive Container

```tsx
<div className="w-full max-w-sm sm:max-w-md md:max-w-2xl mx-auto 
    p-4 sm:p-6 md:p-8">
  {/* Content stays centered and doesn't exceed max-width */}
</div>
```

## Common Responsive Patterns

### Stacking on Mobile
```tsx
// Flex row on desktop, column on mobile
<div className="flex flex-col sm:flex-row gap-4">
  <div className="flex-1">Left</div>
  <div className="flex-1">Right</div>
</div>
```

### Responsive Sidebar
```tsx
<div className="flex flex-col md:flex-row">
  <aside className="w-full md:w-64 mb-6 md:mb-0">
    {/* Sidebar full width on mobile, fixed on desktop */}
  </aside>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>
```

### Responsive Cards
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {cards.map(card => (
    <div key={card.id} className="p-4 sm:p-6 bg-card rounded-lg">
      {card.content}
    </div>
  ))}
</div>
```

## Accessibility Checklist

- [ ] Touch targets are 44x44px minimum
- [ ] Text is readable at 16px+ on mobile
- [ ] No horizontal scrolling needed
- [ ] Color contrast ratio > 4.5:1
- [ ] Interactive elements properly spaced
- [ ] Focus states visible
- [ ] Form labels associated with inputs

## Performance Tips

1. **Mobile-First CSS** - Smaller CSS bundle since desktop enhancements are additions
2. **Image Sizes** - Use responsive images with srcset
3. **Lazy Loading** - Defer loading of off-screen images
4. **Code Splitting** - Import heavy components only when needed

## Testing Checklist

- [ ] Test on iPhone SE (320px)
- [ ] Test on iPhone 12/13 (390px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1200px+)
- [ ] Test portrait and landscape
- [ ] Test with browser zoom
- [ ] Test touch on actual device
- [ ] Test keyboard navigation
- [ ] Test screen reader

## Common Mistakes to Avoid

❌ **DON'T:**
- Use fixed widths (width: 900px)
- Force horizontal scrolling
- Make buttons smaller than 44px
- Use font smaller than 16px on inputs
- Forget about landscape orientation
- Test only on Chrome DevTools

✅ **DO:**
- Use responsive classes (sm:, md:, lg:)
- Ensure full width on mobile
- Make buttons at least 44x44px
- Use 16px+ for input fields
- Test landscape and portrait
- Test on real devices

## Useful Resources

- Mobile Utilities: `src/lib/mobile-utils.ts`
- Global Styles: `src/index.css`
- Tailwind Docs: https://tailwindcss.com/docs/responsive-design
- MDN Mobile: https://developer.mozilla.org/docs/Mobile

---

**Last Updated**: December 14, 2025
