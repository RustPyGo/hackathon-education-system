import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormField, Input } from '@/components/ui/form';
import Button from '@/components/ui/Button';
import {
    NAME_PLACEHOLDER,
    EMAIL_PLACEHOLDER,
    PASSWORD_PLACEHOLDER,
    CONFIRM_PASSWORD_PLACEHOLDER,
    REGISTER_BUTTON_TEXT,
    LOADING_TEXT,
} from './constants';
import type { RegisterFormData } from './types';

interface RegisterFormProps {
    isLoading: boolean;
    className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    isLoading,
    className = '',
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        register,
        formState: { errors },
    } = useFormContext<RegisterFormData>();

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Name Field */}
            <FormField label="Họ và tên" required error={errors.name?.message}>
                <Input
                    type="text"
                    placeholder={NAME_PLACEHOLDER}
                    {...register('name')}
                    variant={errors.name ? 'error' : 'default'}
                    disabled={isLoading}
                />
            </FormField>

            {/* Email Field */}
            <FormField label="Email" required error={errors.email?.message}>
                <Input
                    type="email"
                    placeholder={EMAIL_PLACEHOLDER}
                    {...register('email')}
                    variant={errors.email ? 'error' : 'default'}
                    disabled={isLoading}
                />
            </FormField>

            {/* Password Field */}
            <FormField
                label="Mật khẩu"
                required
                error={errors.password?.message}
            >
                <div className="relative">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={PASSWORD_PLACEHOLDER}
                        {...register('password')}
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

            {/* Confirm Password Field */}
            <FormField
                label="Xác nhận mật khẩu"
                required
                error={errors.confirmPassword?.message}
            >
                <div className="relative">
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
                        {...register('confirmPassword')}
                        variant={errors.confirmPassword ? 'error' : 'default'}
                        disabled={isLoading}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                        disabled={isLoading}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                        )}
                    </button>
                </div>
            </FormField>

            {/* Register Button */}
            <Button
                type="submit"
                mode="contained"
                colorScheme="primary"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? LOADING_TEXT : REGISTER_BUTTON_TEXT}
            </Button>
        </div>
    );
};

export default RegisterForm;
