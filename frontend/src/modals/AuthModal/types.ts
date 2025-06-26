import type { FieldValues, UseFormReturn } from 'react-hook-form';

export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'register' | 'forgot-password';
}

// Form schemas for React Hook Form
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPasswordFormData {
    email: string;
}

// Legacy types for backward compatibility
export type LoginData = LoginFormData;
export type RegisterData = RegisterFormData;
export type ForgotPasswordData = ForgotPasswordFormData;

export interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export type AuthTab = 'login' | 'register' | 'forgot-password';

export interface AuthResponse {
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

// Form context types
export interface FormContextType<T extends FieldValues> {
    form: UseFormReturn<T>;
    isLoading: boolean;
    onSubmit: (data: T) => Promise<void>;
}
