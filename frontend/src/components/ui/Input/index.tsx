import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'error';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <input
                className={cn(
                    'w-full px-3 py-2 border rounded-md text-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                    'placeholder:text-gray-400',
                    variant === 'error'
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 hover:border-gray-400',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';

export default Input;
