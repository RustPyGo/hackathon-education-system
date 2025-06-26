import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormField, Input } from '@/components/ui/form';
import Button from '@/components/ui/Button';
import {
    EMAIL_PLACEHOLDER,
    PASSWORD_PLACEHOLDER,
    LOGIN_BUTTON_TEXT,
    LOADING_TEXT,
    FORGOT_PASSWORD_TEXT,
} from './constants';
import type { LoginData, FormErrors } from './types';

interface LoginFormProps {
    formData: LoginData;
    errors: FormErrors;
    isLoading: boolean;
    onInputChange: (field: keyof LoginData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
    formData,
    errors,
    isLoading,
    onInputChange,
    onSubmit,
    className = '',
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
            {/* Email Field */}
            <FormField label="Email" required error={errors.email}>
                <Input
                    type="email"
                    placeholder={EMAIL_PLACEHOLDER}
                    value={formData.email}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    variant={errors.email ? 'error' : 'default'}
                    disabled={isLoading}
                />
            </FormField>

            {/* Password Field */}
            <FormField label="Mật khẩu" required error={errors.password}>
                <div className="relative">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={PASSWORD_PLACEHOLDER}
                        value={formData.password}
                        onChange={(e) =>
                            onInputChange('password', e.target.value)
                        }
                        variant={errors.password ? 'error' : 'default'}
                        disabled={isLoading}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                        )}
                    </button>
                </div>
            </FormField>

            {/* Forgot Password Link */}
            <div className="text-right">
                <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                    disabled={isLoading}
                >
                    {FORGOT_PASSWORD_TEXT}
                </button>
            </div>

            {/* Login Button */}
            <Button
                type="submit"
                mode="contained"
                colorScheme="primary"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? LOADING_TEXT : LOGIN_BUTTON_TEXT}
            </Button>
        </form>
    );
};

export default LoginForm;
