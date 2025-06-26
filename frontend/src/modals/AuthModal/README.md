# AuthModal Component (React Hook Form)

AuthModal là một component modal xác thực hoàn chỉnh với đăng nhập, đăng ký và quên mật khẩu, được tổ chức theo quy tắc PascalCase với cấu trúc modular và tái sử dụng. Sử dụng **React Hook Form** để quản lý form state và validation.

## Cấu trúc thư mục

```
AuthModal/
├── index.tsx              # Component chính với FormProvider
├── index.ts               # Exports
├── ModalHeader.tsx        # Header với tabs
├── LoginForm.tsx          # Form đăng nhập (React Hook Form)
├── RegisterForm.tsx       # Form đăng ký (React Hook Form)
├── ForgotPasswordForm.tsx # Form quên mật khẩu (React Hook Form)
├── SocialLogin.tsx        # Social login buttons
├── TabLinks.tsx           # Links chuyển đổi tabs
├── types.ts               # Type definitions
├── constants.ts           # Constants & Validation schemas
├── hooks.ts               # Custom hooks với React Hook Form
├── Demo.tsx               # Demo component
└── README.md              # Documentation
```

## React Hook Form Features

### ✅ Form Management

-   **Automatic form state management** - Không cần quản lý state thủ công
-   **Built-in validation with Yup** - Validation schema mạnh mẽ
-   **Real-time validation** - Validation ngay khi user nhập
-   **Form reset on close** - Tự động reset form khi đóng modal
-   **Error handling** - Xử lý lỗi tự động

### ✅ Performance

-   **Optimized re-renders** - Chỉ re-render khi cần thiết
-   **Controlled inputs** - Input được control bởi React Hook Form
-   **Debounced validation** - Validation được debounce để tối ưu performance
-   **Memory efficient** - Sử dụng memory hiệu quả
-   **Fast form switching** - Chuyển đổi form nhanh chóng

### ✅ Developer Experience

-   **TypeScript support** - Full type safety
-   **Form context** - Sử dụng FormProvider để share form state
-   **Easy validation rules** - Validation rules dễ dàng định nghĩa
-   **Clean API** - API sạch sẽ và dễ sử dụng
-   **Debug tools** - Có thể debug form state

## Components

### AuthModal (index.tsx)

Component chính kết hợp tất cả subcomponents với React Hook Form.

**Props:**

```tsx
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'register' | 'forgot-password';
}
```

### ModalHeader.tsx

Header của modal với close button.

**Props:**

```tsx
interface ModalHeaderProps {
    activeTab: AuthTab;
    onClose: () => void;
    onTabChange: (tab: AuthTab) => void;
    isLoading?: boolean;
    className?: string;
}
```

### LoginForm.tsx

Form đăng nhập sử dụng React Hook Form với email, password và validation.

**Props:**

```tsx
interface LoginFormProps {
    isLoading: boolean;
    onForgotPassword: () => void;
    className?: string;
}
```

**Features:**

-   Sử dụng `useFormContext` để access form state
-   Validation với Yup schema
-   Show/hide password toggle
-   Real-time error display

### RegisterForm.tsx

Form đăng ký sử dụng React Hook Form với name, email, password, confirmPassword.

**Props:**

```tsx
interface RegisterFormProps {
    isLoading: boolean;
    className?: string;
}
```

**Features:**

-   Sử dụng `useFormContext` để access form state
-   Validation với Yup schema
-   Password confirmation validation
-   Show/hide password toggles

### ForgotPasswordForm.tsx

Form quên mật khẩu sử dụng React Hook Form với email.

**Props:**

```tsx
interface ForgotPasswordFormProps {
    isLoading: boolean;
    onBackToLogin: () => void;
    className?: string;
}
```

**Features:**

-   Sử dụng `useFormContext` để access form state
-   Validation với Yup schema
-   Back to login link

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

### TabLinks.tsx

Links chuyển đổi giữa các tabs.

**Props:**

```tsx
interface TabLinksProps {
    activeTab: AuthTab;
    onTabChange: (tab: AuthTab) => void;
    isLoading?: boolean;
    className?: string;
}
```

## Hooks

### useAuthModal()

Custom hook quản lý state và logic của AuthModal với React Hook Form.

**Returns:**

```tsx
{
    // Modal state
    isOpen: boolean;
    activeTab: AuthTab;
    isLoading: boolean;

    // React Hook Form instances
    loginForm: UseFormReturn<LoginFormData>;
    registerForm: UseFormReturn<RegisterFormData>;
    forgotPasswordForm: UseFormReturn<ForgotPasswordFormData>;

    // Modal controls
    openModal: (tab?: AuthTab) => void;
    closeModal: () => void;
    switchTab: (tab: AuthTab) => void;

    // Form handlers
    handleLogin: (data: LoginFormData) => Promise<void>;
    handleRegister: (data: RegisterFormData) => Promise<void>;
    handleForgotPassword: (data: ForgotPasswordFormData) => Promise<void>;
    handleGoogleLogin: () => Promise<void>;
    handleFacebookLogin: () => Promise<void>;
}
```

## Types

### Form Data Types

```tsx
interface LoginFormData {
    email: string;
    password: string;
}

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ForgotPasswordFormData {
    email: string;
}
```

### Legacy Types (for backward compatibility)

```tsx
type LoginData = LoginFormData;
type RegisterData = RegisterFormData;
type ForgotPasswordData = ForgotPasswordFormData;
```

### Other Types

```tsx
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'register' | 'forgot-password';
}

type AuthTab = 'login' | 'register' | 'forgot-password';

interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    token?: string;
}

interface FormContextType<T extends FieldValues> {
    form: UseFormReturn<T>;
    isLoading: boolean;
    onSubmit: (data: T) => Promise<void>;
}
```

## Validation Schemas

### Login Schema

```tsx
export const loginSchema = yup.object({
    email: yup
        .string()
        .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL_INVALID),
    password: yup
        .string()
        .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
        .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
});
```

### Register Schema

```tsx
export const registerSchema = yup.object({
    name: yup
        .string()
        .required(VALIDATION_MESSAGES.NAME_REQUIRED)
        .min(2, VALIDATION_MESSAGES.NAME_MIN_LENGTH),
    email: yup
        .string()
        .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL_INVALID),
    password: yup
        .string()
        .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
        .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: yup
        .string()
        .required(VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
        .oneOf([yup.ref('password')], VALIDATION_MESSAGES.PASSWORD_MATCH),
});
```

### Forgot Password Schema

```tsx
export const forgotPasswordSchema = yup.object({
    email: yup
        .string()
        .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL_INVALID),
});
```

## Cách sử dụng

### Basic Usage

```tsx
import { AuthModal, useAuthModal } from '@/modals/AuthModal';

const MyComponent = () => {
    const { isOpen, openModal, closeModal } = useAuthModal();

    return (
        <div>
            <button onClick={() => openModal('login')}>Đăng nhập</button>
            <button onClick={() => openModal('register')}>Đăng ký</button>
            <button onClick={() => openModal('forgot-password')}>
                Quên mật khẩu
            </button>

            <AuthModal
                isOpen={isOpen}
                onClose={closeModal}
                defaultTab="login"
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
    RegisterForm,
    ForgotPasswordForm,
    SocialLogin,
    TabLinks,
} from '@/modals/AuthModal';
```

### Import hooks

```tsx
import { useAuthModal } from '@/modals/AuthModal';
```

### Import validation schemas

```tsx
import {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
} from '@/modals/AuthModal';
```

## API Integration Points

### 1. Login API

```tsx
const handleLogin = useCallback(
    async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            // {{cursor}}
            // TODO: Call login API
            const response: AuthResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Form data passed automatically
            }).then((res) => res.json());

            if (response.success && response.user && response.token) {
                await authLogin(data.email, data.password);
                alert(LOGIN_SUCCESS_MESSAGE);
                closeModal();
            } else {
                alert(response.message || LOGIN_FAILED_MESSAGE);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(LOGIN_FAILED_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    },
    [authLogin, closeModal]
);
```

### 2. Register API

```tsx
const handleRegister = useCallback(
    async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            // {{cursor}}
            // TODO: Call register API
            const response: AuthResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }), // Form data passed automatically
            }).then((res) => res.json());

            if (response.success && response.user && response.token) {
                await authLogin(data.email, data.password);
                alert(REGISTER_SUCCESS_MESSAGE);
                closeModal();
            } else {
                alert(response.message || REGISTER_FAILED_MESSAGE);
            }
        } catch (error) {
            console.error('Register error:', error);
            alert(REGISTER_FAILED_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    },
    [authLogin, closeModal]
);
```

### 3. Forgot Password API

```tsx
const handleForgotPassword = useCallback(
    async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            // {{cursor}}
            // TODO: Call forgot password API
            const response: AuthResponse = await fetch(
                '/api/auth/forgot-password',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data), // Form data passed automatically
                }
            ).then((res) => res.json());

            if (response.success) {
                alert(RESET_LINK_SENT_MESSAGE);
                switchTab('login');
            } else {
                alert(response.message || RESET_LINK_FAILED_MESSAGE);
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            alert(RESET_LINK_FAILED_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    },
    [switchTab]
);
```

### 4. Google OAuth

```tsx
const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
        // {{cursor}}
        // TODO: Implement Google OAuth login
        console.log('Google login clicked');
    } catch (error) {
        console.error('Google login failed:', error);
    } finally {
        setIsLoading(false);
    }
}, []);
```

### 5. Facebook OAuth

```tsx
const handleFacebookLogin = useCallback(async () => {
    setIsLoading(true);
    try {
        // {{cursor}}
        // TODO: Implement Facebook OAuth login
        console.log('Facebook login clicked');
    } catch (error) {
        console.error('Facebook login failed:', error);
    } finally {
        setIsLoading(false);
    }
}, []);
```

## Features

-   ✅ **React Hook Form Integration** - Form state management tự động
-   ✅ **Yup Validation** - Validation schema mạnh mẽ
-   ✅ **Real-time Validation** - Validation ngay khi user nhập
-   ✅ **Form Context** - Sử dụng FormProvider để share state
-   ✅ **Login Form** - Email, password validation, show/hide password
-   ✅ **Register Form** - Name, email, password, confirm password validation
-   ✅ **Forgot Password Form** - Email validation, send reset link
-   ✅ **Tab Navigation** - Switch between login, register, forgot password
-   ✅ **Social Login** - Google and Facebook login buttons
-   ✅ **Form Validation** - Real-time validation with error messages
-   ✅ **Loading States** - Loading indicators during API calls
-   ✅ **Error Handling** - Proper error handling and user feedback
-   ✅ **Responsive Design** - Works on all screen sizes
-   ✅ **Keyboard Navigation** - ESC to close, tab navigation
-   ✅ **Auto-reset Forms** - Clear forms when closing modal
-   ✅ **TypeScript Support** - Full type safety
-   ✅ **Modular Architecture** - Reusable subcomponents
-   ✅ **PascalCase Structure** - Consistent naming convention
-   ✅ **Performance Optimized** - Minimal re-renders
-   ✅ **Memory Efficient** - Efficient memory usage

## Dependencies

-   `react-hook-form` - Form state management
-   `@hookform/resolvers` - Validation resolvers
-   `yup` - Validation schema
-   `react-modal` - Modal functionality
-   `lucide-react` - Icons (X, Eye, EyeOff)
-   `@/components/ui/form` - FormField, Input components
-   `@/components/ui/button` - Button component
-   `@/hooks/useAuth` - Authentication hook

## Demo

Xem file `Demo.tsx` để xem tất cả features và examples.

## API Endpoints Required

1. **POST /api/auth/login** - Login with email and password
2. **POST /api/auth/register** - Register new user
3. **POST /api/auth/forgot-password** - Send password reset email
4. **Google OAuth Integration** - Google login
5. **Facebook OAuth Integration** - Facebook login

## Validation Rules

### Login

-   Email: Required, valid email format (Yup)
-   Password: Required, minimum 6 characters (Yup)

### Register

-   Name: Required, minimum 2 characters (Yup)
-   Email: Required, valid email format (Yup)
-   Password: Required, minimum 6 characters (Yup)
-   Confirm Password: Required, must match password (Yup)

### Forgot Password

-   Email: Required, valid email format (Yup)

## Migration from Old Version

Nếu bạn đang sử dụng phiên bản cũ, đây là những thay đổi chính:

### Before (Manual Form State)

```tsx
const [loginData, setLoginData] = useState({ email: '', password: '' });
const [loginErrors, setLoginErrors] = useState({});

const updateLoginData = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
};
```

### After (React Hook Form)

```tsx
const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
});

// Form data và errors được quản lý tự động
// Validation được xử lý tự động
// Re-renders được tối ưu
```
