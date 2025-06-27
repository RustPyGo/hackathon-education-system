import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from './variants';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export type ButtonMode = 'contained' | 'outlined' | 'none';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColorScheme = 'primary' | 'secondary' | 'error';
