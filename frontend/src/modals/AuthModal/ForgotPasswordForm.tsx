import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Input } from '@/components/ui/form';
import Button from '@/components/ui/Button';
import {
    EMAIL_PLACEHOLDER,
    SEND_RESET_LINK_TEXT,
    LOADING_TEXT,
    BACK_TO_LOGIN_TEXT,
} from './constants';
import type { ForgotPasswordFormData } from './types';

interface ForgotPasswordFormProps {
    isLoading: boolean;
    onBackToLogin: () => void;
    className?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    isLoading,
    onBackToLogin,
    className = '',
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<ForgotPasswordFormData>();

    return (
        <div className={className}>
            {/* Description */}
            <div className="text-center mb-6">
                <p className="text-gray-600">
                    Nhập email của bạn để nhận link đặt lại mật khẩu
                </p>
            </div>

            <div className="space-y-6">
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

                {/* Send Reset Link Button */}
                <Button
                    type="submit"
                    mode="contained"
                    colorScheme="primary"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? LOADING_TEXT : SEND_RESET_LINK_TEXT}
                </Button>

                {/* Back to Login Link */}
                <div className="text-center">
                    <button
                        type="button"
                        className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                        onClick={onBackToLogin}
                        disabled={isLoading}
                    >
                        {BACK_TO_LOGIN_TEXT}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
