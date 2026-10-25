# Theming & Dark Mode Guide

Regulatório UI uses a highly efficient, token-based theming system powered by **Tailwind CSS v4** and **CSS Variables**.

## How it works
Instead of hardcoding colors like `bg-blue-500` into your React components, we use semantic utility classes like `bg-primary` and `text-foreground`. These semantic names map directly to CSS variables defined in `src/app/globals.css`.

## Changing the Primary Color
Open `src/app/globals.css`. You will find the root configuration:

```css
@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... */
}

:root {
  --background: oklch(1 0 0); /* White */
  --primary: oklch(0.2 0.05 250); /* Dark Slate Blue */
}
```

To change your brand color, simply modify the OKLCH values for `--primary`.
- **Tip**: You can use tools like [oklch.com](https://oklch.com/) to find the perfect color values.

## Dark Mode
Dark mode is fully supported via the `next-themes` package. 
When dark mode is active, the `.dark` class is applied to the HTML tag. 

In `globals.css`, you will see:
```css
.dark {
  --background: oklch(0.15 0.05 250); /* Dark background */
  --foreground: oklch(0.98 0 0); /* Light text */
}
```
All components will automatically adapt without you having to write `dark:bg-slate-900` in every single file!
