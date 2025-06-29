'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export default function LoadingSpinner({
    size = 'md',
    text,
    className = '',
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
            {text && (
                <span className={`text-gray-600 ${textSizeClasses[size]}`}>
                    {text}
                </span>
            )}
        </div>
    );
}
