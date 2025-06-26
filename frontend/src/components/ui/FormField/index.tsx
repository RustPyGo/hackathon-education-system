import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
    label?: string;
    error?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
    helperText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    required = false,
    className,
    children,
    helperText,
}) => {
    return (
        <div className={cn('space-y-2', className)}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Field */}
            <div className="relative">{children}</div>

            {/* Helper Text */}
            {helperText && !error && (
                <p className="text-xs text-gray-500">{helperText}</p>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-xs text-red-600 flex items-center">
                    <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormField;
