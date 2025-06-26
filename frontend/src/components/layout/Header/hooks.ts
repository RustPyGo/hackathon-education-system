import { useState, useCallback } from 'react';
import { useAuthModal } from '@/modals';
import { useAuth } from '@/features/auth';

export const useHeader = () => {
    const { openModal } = useAuthModal();
    const { user, isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }, [isMobileMenuOpen]);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        closeMobileMenu();
    }, [logout, closeMobileMenu]);

    const handleLoginClick = useCallback(() => {
        openModal('login');
        closeMobileMenu();
    }, [openModal, closeMobileMenu]);

    return {
        user,
        isLoggedIn: isAuthenticated,
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        handleLogout,
        handleLoginClick,
    };
};
