import React from 'react';
import { NAVIGATION_ITEMS } from './constants';
import type { NavigationItem } from './types';

interface NavigationProps {
    items?: NavigationItem[];
    onItemClick?: () => void;
    className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
    items = NAVIGATION_ITEMS,
    onItemClick,
    className = '',
}) => {
    const handleClick = () => {
        onItemClick?.();
    };

    return (
        <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
            {items.map((item) => (
                <a
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={handleClick}
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
};

export default Navigation;
