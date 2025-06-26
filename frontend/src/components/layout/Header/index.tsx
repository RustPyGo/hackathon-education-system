import React from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import UserSection from './UserSection';
import MobileMenu from './MobileMenu';
import { useHeader } from './hooks';
import type { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
    const {
        user,
        isLoggedIn,
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        handleLogout,
        handleLoginClick,
    } = useHeader();

    return (
        <header
            className={`bg-white border-b border-gray-200 shadow-sm relative ${className}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Left */}
                    <Logo />

                    {/* Navigation - Center */}
                    <Navigation onItemClick={closeMobileMenu} />

                    {/* Account Section - Right */}
                    <div className="flex items-center space-x-4">
                        <UserSection
                            user={user}
                            isLoggedIn={isLoggedIn}
                            onLoginClick={handleLoginClick}
                        />

                        {/* Mobile Menu */}
                        <MobileMenu
                            isOpen={isMobileMenuOpen}
                            isLoggedIn={isLoggedIn}
                            onToggle={toggleMobileMenu}
                            onItemClick={closeMobileMenu}
                            onLoginClick={handleLoginClick}
                            onLogoutClick={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
