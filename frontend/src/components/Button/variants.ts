import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer",
    {
        variants: {
            mode: {
                contained: 'shadow-sm',
                outlined: 'border-2 bg-transparent',
                none: 'bg-transparent border-none shadow-none',
            },
            size: {
                small: 'h-8 px-3 py-1.5 text-xs',
                medium: 'h-10 px-4 py-2 text-sm',
                large: 'h-12 px-6 py-3 text-base',
            },
            colorScheme: {
                primary: '',
                secondary: '',
                error: '',
            },
        },
        compoundVariants: [
            {
                mode: 'contained',
                colorScheme: 'primary',
                class: 'bg-primary-500 text-primary-50 hover:bg-primary-600 focus-visible:ring-primary-500',
            },
            {
                mode: 'contained',
                colorScheme: 'secondary',
                class: 'bg-secondary-600 text-secondary-50 hover:bg-secondary-700 focus-visible:ring-secondary-500',
            },
            {
                mode: 'contained',
                colorScheme: 'error',
                class: 'bg-error-600 text-error-50 hover:bg-error-700 focus-visible:ring-error-500',
            },
            {
                mode: 'outlined',
                colorScheme: 'primary',
                class: 'border-primary-500 text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500',
            },
            {
                mode: 'outlined',
                colorScheme: 'secondary',
                class: 'border-secondary-600 text-secondary-600 hover:bg-secondary-50 focus-visible:ring-secondary-500',
            },
            {
                mode: 'outlined',
                colorScheme: 'error',
                class: 'border-error-600 text-error-600 hover:bg-error-50 focus-visible:ring-error-500',
            },
            {
                mode: 'none',
                colorScheme: 'primary',
                class: 'text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500',
            },
            {
                mode: 'none',
                colorScheme: 'secondary',
                class: 'text-secondary-600 hover:bg-secondary-50 focus-visible:ring-secondary-500',
            },
            {
                mode: 'none',
                colorScheme: 'error',
                class: 'text-error-600 hover:bg-error-50 focus-visible:ring-error-500',
            },
        ],
        defaultVariants: {
            mode: 'contained',
            size: 'medium',
            colorScheme: 'primary',
        },
    }
);
