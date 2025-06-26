# Header Component

Header component được tổ chức theo quy tắc PascalCase với cấu trúc modular và tái sử dụng.

## Cấu trúc thư mục

```
Header/
├── index.tsx          # Component chính
├── index.ts           # Exports
├── Logo.tsx           # Logo subcomponent
├── Navigation.tsx     # Navigation subcomponent
├── UserSection.tsx    # User section subcomponent
├── MobileMenu.tsx     # Mobile menu subcomponent
├── types.ts           # Type definitions
├── constants.ts       # Constants
├── hooks.ts           # Custom hooks
├── Demo.tsx           # Demo component
└── README.md          # Documentation
```

## Components

### Header (index.tsx)

Component chính kết hợp tất cả subcomponents.

**Props:**

```tsx
interface HeaderProps {
    className?: string;
}
```

### Logo.tsx

Hiển thị logo và brand name.

### Navigation.tsx

Navigation menu cho desktop.

**Props:**

```tsx
interface NavigationProps {
    items?: NavigationItem[];
    onItemClick?: () => void;
    className?: string;
}
```

### UserSection.tsx

Phần user avatar, notifications, settings và login button.

**Props:**

```tsx
interface UserSectionProps {
    user: User | null;
    isLoggedIn: boolean;
    onLoginClick: () => void;
    className?: string;
}
```

### MobileMenu.tsx

Mobile menu với hamburger button và collapsible navigation.

**Props:**

```tsx
interface MobileMenuProps {
    isOpen: boolean;
    isLoggedIn: boolean;
    onToggle: () => void;
    onItemClick: () => void;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    className?: string;
}
```

## Hooks

### useHeader()

Custom hook quản lý state và logic của Header.

**Returns:**

```tsx
{
    user: User | null;
    isLoggedIn: boolean;
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
    handleLogout: () => void;
    handleLoginClick: () => void;
}
```

## Types

### NavigationItem

```tsx
interface NavigationItem {
    href: string;
    label: string;
}
```

### HeaderProps

```tsx
interface HeaderProps {
    className?: string;
}
```

## Constants

### NAVIGATION_ITEMS

Array các navigation items mặc định.

### BRAND_NAME

Tên brand ("Mola").

### NOTIFICATION_COUNT

Số lượng notifications (3).

## Cách sử dụng

### Basic Usage

```tsx
import Header from '@/components/layout/Header';

<Header />;
```

### Với custom className

```tsx
<Header className="custom-header" />
```

### Import subcomponents

```tsx
import {
    Logo,
    Navigation,
    UserSection,
    MobileMenu,
} from '@/components/layout/Header';
```

### Import hooks

```tsx
import { useHeader } from '@/components/layout/Header';
```

## Features

-   ✅ Responsive design
-   ✅ Mobile menu với animation
-   ✅ Login/Logout integration
-   ✅ User state management
-   ✅ Modular architecture
-   ✅ TypeScript support
-   ✅ PascalCase structure
-   ✅ Reusable subcomponents

## Dependencies

-   `@/modals` - LoginModal integration
-   `@/hooks/useAuth` - Authentication
-   `@/components/ui/button` - Button component
-   `lucide-react` - Icons
