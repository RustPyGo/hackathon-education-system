// Legacy LoginModal (for backward compatibility)
export { default as LoginModal } from './LoginModal';
export type { LoginModalProps, LoginData, FormErrors } from './LoginModal';
export { useLoginModal } from './LoginModal';

// New AuthModal (recommended)
export { default as AuthModal } from './AuthModal';
export { useAuthModal } from './AuthModal';
export type {
    AuthModalProps,
    LoginData as AuthLoginData,
    RegisterData,
    ForgotPasswordData,
    FormErrors as AuthFormErrors,
    AuthTab,
    AuthResponse,
} from './AuthModal';
