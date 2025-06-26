import { useState, useCallback } from 'react';
import type { LoginData } from './types';
import { useAuth } from '@/features/auth';

export const useLoginModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { login } = useAuth();

    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleLogin = useCallback(
        async (data: LoginData) => {
            try {
                // Use the auth hook for login
                await login({ email: data.email, password: data.password });

                // Close modal on success
                closeModal();

                // You can add success notification here
                alert('Đăng nhập thành công!');
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        [login, closeModal]
    );

    const handleGoogleLogin = useCallback(async () => {
        try {
            // TODO: Implement Google OAuth login
            console.log('Google login clicked');

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            closeModal();
            alert('Đăng nhập Google thành công!');
        } catch (error) {
            console.error('Google login failed:', error);
            throw error;
        }
    }, [closeModal]);

    const handleFacebookLogin = useCallback(async () => {
        try {
            // TODO: Implement Facebook OAuth login
            console.log('Facebook login clicked');

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            closeModal();
            alert('Đăng nhập Facebook thành công!');
        } catch (error) {
            console.error('Facebook login failed:', error);
            throw error;
        }
    }, [closeModal]);

    return {
        isOpen,
        openModal,
        closeModal,
        handleLogin,
        handleGoogleLogin,
        handleFacebookLogin,
    };
};
