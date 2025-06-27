# Button Component

Button is a basic UI component organized according to PascalCase rules with a modular and reusable structure.

## Directory Structure

```
Button/
├── index.tsx          # Main component
├── index.ts           # Exports
├── types.ts           # Type definitions
├── variants.ts        # Button variants (CVA)
├── constants.ts       # Constants
├── Demo.tsx           # Demo component
└── README.md          # Documentation
```

## Props

### ButtonProps

```tsx
interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
```

### Variants

#### Mode

-   `contained` - Button with background and shadow
-   `outlined` - Button with border and transparent background
-   `none` - Button without background, border, shadow

#### Size

-   `small` - Height 32px, small padding
-   `medium` - Height 40px, medium padding (default)
-   `large` - Height 48px, large padding

#### ColorScheme

-   `primary` - Primary color (default)
-   `secondary` - Secondary color
-   `error` - Error color

## Usage

### Basic Usage

```tsx
import { Button } from '@/components/ui/Button';

// Default button (contained, medium, primary)
<Button>Click me</Button>

// Custom variants
<Button mode="outlined" size="large" colorScheme="secondary">
    Custom Button
</Button>
```

### Import specific exports

```tsx
import Button, { buttonVariants } from '@/components/ui/Button';
import type {
    ButtonProps,
    ButtonMode,
    ButtonSize,
    ButtonColorScheme,
} from '@/components/ui/Button';
import {
    BUTTON_MODES,
    BUTTON_SIZES,
    BUTTON_COLOR_SCHEMES,
} from '@/components/ui/Button';
```

### With Icons

```tsx
<Button mode="contained" colorScheme="primary">
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
    </svg>
    Add Item
</Button>
```

### As Child (Radix Slot)

```tsx
import { Link } from 'react-router-dom';

<Button asChild>
    <Link to="/dashboard">Go to Dashboard</Link>
</Button>;
```

## Examples

### Different Modes

```tsx
<div className="flex gap-4">
    <Button mode="contained" colorScheme="primary">
        Contained
    </Button>
    <Button mode="outlined" colorScheme="primary">
        Outlined
    </Button>
    <Button mode="none" colorScheme="primary">
        None
    </Button>
</div>
```

### Different Sizes

```tsx
<div className="flex items-center gap-4">
    <Button size="small">Small</Button>
    <Button size="medium">Medium</Button>
    <Button size="large">Large</Button>
</div>
```

### Different Color Schemes

```tsx
<div className="flex gap-4">
    <Button mode="contained" colorScheme="primary">
        Primary
    </Button>
    <Button mode="contained" colorScheme="secondary">
        Secondary
    </Button>
    <Button mode="contained" colorScheme="error">
        Error
    </Button>
</div>
```

### States

```tsx
<div className="flex gap-4">
    <Button>Normal</Button>
    <Button disabled>Disabled</Button>
    <Button>
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
        </svg>
        With Icon
    </Button>
</div>
```

## Features

-   ✅ Multiple modes (contained, outlined, none)
-   ✅ Multiple sizes (small, medium, large)
-   ✅ Multiple color schemes (primary, secondary, error)
-   ✅ Disabled state
-   ✅ Icon support
-   ✅ Radix Slot support (asChild)
-   ✅ Keyboard navigation
-   ✅ Focus management
-   ✅ TypeScript support
-   ✅ Class Variance Authority (CVA)
-   ✅ Tailwind CSS
-   ✅ Responsive design
-   ✅ Modular architecture
-   ✅ PascalCase structure

## Dependencies

-   `@radix-ui/react-slot` - Slot functionality
-   `class-variance-authority` - Variant management
-   `@/lib/utils` - Utility functions (cn)

## Demo

See `Demo.tsx` file to view all variants and examples.

## Constants

### BUTTON_MODES

```tsx
{
    CONTAINED: 'contained',
    OUTLINED: 'outlined',
    NONE: 'none',
}
```

### BUTTON_SIZES

```tsx
{
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}
```

### BUTTON_COLOR_SCHEMES

```tsx
{
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    ERROR: 'error',
}
```

### BUTTON_DEFAULT_PROPS

```tsx
{
    MODE: 'contained',
    SIZE: 'medium',
    COLOR_SCHEME: 'primary',
}
```
