import React from 'react';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { NAVIGATION_ITEMS } from './constants';

interface MobileMenuProps {
    isOpen: boolean;
    isLoggedIn: boolean;
    onToggle: () => void;
    onItemClick: () => void;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    className?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    isLoggedIn,
    onToggle,
    onItemClick,
    onLoginClick,
    onLogoutClick,
    className = '',
}) => {
    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className={`md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
                onClick={onToggle}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
                        {NAVIGATION_ITEMS.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={onItemClick}
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Mobile Login/Logout Button */}
                        <div className="px-3 py-2">
                            {isLoggedIn ? (
                                <Button
                                    mode="outlined"
                                    colorScheme="secondary"
                                    className="w-full"
                                    onClick={onLogoutClick}
                                >
                                    Đăng xuất
                                </Button>
                            ) : (
                                <Button
                                    mode="contained"
                                    colorScheme="primary"
                                    className="w-full"
                                    onClick={onLoginClick}
                                >
                                    Đăng nhập
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileMenu;
