import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { buttonVariants } from './variants';
import type { ButtonProps } from './types';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, mode, size, colorScheme, asChild = false, ...props },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(
                    buttonVariants({ mode, size, colorScheme, className })
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export default Button;
