# LoginModal Component

LoginModal là một component modal đăng nhập hoàn chỉnh được tổ chức theo quy tắc PascalCase với cấu trúc modular và tái sử dụng.

## Cấu trúc thư mục

```
LoginModal/
├── index.tsx          # Component chính
├── index.ts           # Exports
├── ModalHeader.tsx    # Header subcomponent
├── LoginForm.tsx      # Form subcomponent
├── SocialLogin.tsx    # Social login subcomponent
├── SignupLink.tsx     # Signup link subcomponent
├── types.ts           # Type definitions
├── constants.ts       # Constants
├── hooks.ts           # Custom hooks
├── Demo.tsx           # Demo component
└── README.md          # Documentation
```

## Components

### LoginModal (index.tsx)

Component chính kết hợp tất cả subcomponents.

**Props:**

```tsx
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin?: (data: LoginData) => void;
    onGoogleLogin?: () => void;
    onFacebookLogin?: () => void;
}
```

### ModalHeader.tsx

Header của modal với title và close button.

**Props:**

```tsx
interface ModalHeaderProps {
    onClose: () => void;
    isLoading?: boolean;
    className?: string;
}
```

### LoginForm.tsx

Form đăng nhập với email, password và validation.

**Props:**

```tsx
interface LoginFormProps {
    formData: LoginData;
    errors: FormErrors;
    isLoading: boolean;
    onInputChange: (field: keyof LoginData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
}
```

### SocialLogin.tsx

Social login buttons (Google, Facebook).

**Props:**

```tsx
interface SocialLoginProps {
    onGoogleLogin: () => void;
    onFacebookLogin: () => void;
    isLoading: boolean;
    className?: string;
}
```

### SignupLink.tsx

Link đăng ký tài khoản.

**Props:**

```tsx
interface SignupLinkProps {
    isLoading?: boolean;
    className?: string;
}
```

## Hooks

### useLoginModal()

Custom hook quản lý state và logic của LoginModal.

**Returns:**

```tsx
{
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    handleLogin: (data: LoginData) => Promise<void>;
    handleGoogleLogin: () => Promise<void>;
    handleFacebookLogin: () => Promise<void>;
}
```

## Types

### LoginData

```tsx
interface LoginData {
    email: string;
    password: string;
}
```

### FormErrors

```tsx
interface FormErrors {
    email?: string;
    password?: string;
}
```

### LoginModalProps

```tsx
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin?: (data: LoginData) => void;
    onGoogleLogin?: () => void;
    onFacebookLogin?: () => void;
}
```

## Constants

### Text Constants

-   `MODAL_TITLE` - "Đăng nhập"
-   `EMAIL_PLACEHOLDER` - "Nhập email của bạn"
-   `PASSWORD_PLACEHOLDER` - "Nhập mật khẩu"
-   `LOGIN_BUTTON_TEXT` - "Đăng nhập"
-   `LOADING_TEXT` - "Đang đăng nhập..."
-   `FORGOT_PASSWORD_TEXT` - "Quên mật khẩu?"
-   `GOOGLE_LOGIN_TEXT` - "Đăng nhập với Google"
-   `FACEBOOK_LOGIN_TEXT` - "Đăng nhập với Facebook"
-   `SIGNUP_TEXT` - "Chưa có tài khoản?"
-   `SIGNUP_LINK_TEXT` - "Đăng ký ngay"
-   `OR_DIVIDER_TEXT` - "hoặc"

### Validation Messages

```tsx
VALIDATION_MESSAGES = {
    EMAIL_REQUIRED: 'Email là bắt buộc',
    EMAIL_INVALID: 'Email không hợp lệ',
    PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc',
    PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
};
```

## Cách sử dụng

### Basic Usage

```tsx
import { LoginModal, useLoginModal } from '@/modals';

const MyComponent = () => {
    const { isOpen, openModal, closeModal, handleLogin } = useLoginModal();

    return (
        <div>
            <button onClick={openModal}>Đăng nhập</button>
            <LoginModal
                isOpen={isOpen}
                onClose={closeModal}
                onLogin={handleLogin}
            />
        </div>
    );
};
```

### Import subcomponents

```tsx
import {
    ModalHeader,
    LoginForm,
    SocialLogin,
    SignupLink,
} from '@/modals/LoginModal';
```

### Import hooks

```tsx
import { useLoginModal } from '@/modals/LoginModal';
```

## Features

-   ✅ Form đăng nhập với email và mật khẩu
-   ✅ Validation form real-time
-   ✅ Show/hide password
-   ✅ Đăng nhập Google
-   ✅ Đăng nhập Facebook
-   ✅ Loading states
-   ✅ Responsive design
-   ✅ Keyboard navigation (ESC để đóng)
-   ✅ Auto-reset form khi đóng
-   ✅ Modular architecture
-   ✅ TypeScript support
-   ✅ PascalCase structure
-   ✅ Reusable subcomponents

## Dependencies

-   `react-modal` - Modal functionality
-   `lucide-react` - Icons (X, Eye, EyeOff)
-   `@/components/ui/form` - FormField, Input components
-   `@/components/ui/button` - Button component
-   `@/hooks/useAuth` - Authentication

## Demo

Xem file `demo.tsx`
