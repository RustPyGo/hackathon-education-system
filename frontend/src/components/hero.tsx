import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

export const HeroTitle = ({
    children,
    className,
}: PropsWithChildren<{ className: string }>) => {
    return (
        <h1
            className={cn(
                'text-5xl md:text-6xl font-bold mb-6 leading-tight',
                className,
            )}
        >
            {children}
        </h1>
    );
};

export const HeroDescription = ({ children }: PropsWithChildren) => {
    return (
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {children}
        </p>
    );
};

export const Hero = ({ children }: PropsWithChildren) => {
    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-4xl mx-auto">{children}</div>
            </div>
        </section>
    );
};
