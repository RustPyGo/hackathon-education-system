import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type {
    LoginFormData,
    RegisterFormData,
    ForgotPasswordFormData,
    AuthTab,
    AuthResponse,
} from './types';
import { useAuth } from '@/features/auth';
import {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    LOGIN_SUCCESS_MESSAGE,
    REGISTER_SUCCESS_MESSAGE,
    RESET_LINK_SENT_MESSAGE,
    LOGIN_FAILED_MESSAGE,
    REGISTER_FAILED_MESSAGE,
    RESET_LINK_FAILED_MESSAGE,
} from './constants';

export const useAuthModal = (defaultTab: AuthTab = 'login') => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
    const [isLoading, setIsLoading] = useState(false);
    const {
        login: authLogin,
        register: authRegister,
        forgotPassword: authForgotPassword,
    } = useAuth();

    // React Hook Form instances
    const loginForm = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
    });

    const registerForm = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
        mode: 'onChange',
    });

    const forgotPasswordForm = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(forgotPasswordSchema),
        mode: 'onChange',
    });

    // Modal Controls
    const openModal = useCallback((tab?: AuthTab) => {
        setIsOpen(true);
        if (tab) {
            setActiveTab(tab);
        }
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        // Reset all forms
        loginForm.reset();
        registerForm.reset();
        forgotPasswordForm.reset();
        setIsLoading(false);
    }, [loginForm, registerForm, forgotPasswordForm]);

    const switchTab = useCallback(
        (tab: AuthTab) => {
            setActiveTab(tab);
            // Clear form errors when switching tabs
            loginForm.clearErrors();
            registerForm.clearErrors();
            forgotPasswordForm.clearErrors();
        },
        [loginForm, registerForm, forgotPasswordForm]
    );

    // Form Handlers
    const handleLogin = useCallback(
        async (data: LoginFormData) => {
            setIsLoading(true);
            try {
                // {{cursor}}
                // TODO: Call login API
                const response: AuthResponse = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then((res) => res.json());

                if (response.success && response.user && response.token) {
                    // Use existing auth hook
                    await authLogin({
                        email: data.email,
                        password: data.password,
                    });
                    alert(LOGIN_SUCCESS_MESSAGE);
                    closeModal();
                } else {
                    alert(response.message || LOGIN_FAILED_MESSAGE);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert(LOGIN_FAILED_MESSAGE);
            } finally {
                setIsLoading(false);
            }
        },
        [authLogin, closeModal]
    );

    const handleRegister = useCallback(
        async (data: RegisterFormData) => {
            setIsLoading(true);
            try {
                // {{cursor}}
                // TODO: Call register API
                const response: AuthResponse = await fetch(
                    '/api/auth/register',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: data.name,
                            email: data.email,
                            password: data.password,
                        }),
                    }
                ).then((res) => res.json());

                if (response.success && response.user && response.token) {
                    // Auto login after successful registration
                    await authRegister({
                        name: data.name,
                        email: data.email,
                        password: data.password,
                    });
                    alert(REGISTER_SUCCESS_MESSAGE);
                    closeModal();
                } else {
                    alert(response.message || REGISTER_FAILED_MESSAGE);
                }
            } catch (error) {
                console.error('Register error:', error);
                alert(REGISTER_FAILED_MESSAGE);
            } finally {
                setIsLoading(false);
            }
        },
        [authRegister, closeModal]
    );

    const handleForgotPassword = useCallback(
        async (data: ForgotPasswordFormData) => {
            setIsLoading(true);
            try {
                // {{cursor}}
                // TODO: Call forgot password API
                const response: AuthResponse = await fetch(
                    '/api/auth/forgot-password',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    }
                ).then((res) => res.json());

                if (response.success) {
                    await authForgotPassword({ email: data.email });
                    alert(RESET_LINK_SENT_MESSAGE);
                    switchTab('login');
                } else {
                    alert(response.message || RESET_LINK_FAILED_MESSAGE);
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                alert(RESET_LINK_FAILED_MESSAGE);
            } finally {
                setIsLoading(false);
            }
        },
        [authForgotPassword, switchTab]
    );

    const handleGoogleLogin = useCallback(async () => {
        setIsLoading(true);
        try {
            // {{cursor}}
            // TODO: Implement Google OAuth login
            console.log('Google login clicked');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert('Google login functionality will be implemented');
        } catch (error) {
            console.error('Google login failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFacebookLogin = useCallback(async () => {
        setIsLoading(true);
        try {
            // {{cursor}}
            // TODO: Implement Facebook OAuth login
            console.log('Facebook login clicked');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert('Facebook login functionality will be implemented');
        } catch (error) {
            console.error('Facebook login failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        // Modal state
        isOpen,
        activeTab,
        isLoading,

        // Form instances
        loginForm,
        registerForm,
        forgotPasswordForm,

        // Modal controls
        openModal,
        closeModal,
        switchTab,

        // Form handlers
        handleLogin,
        handleRegister,
        handleForgotPassword,
        handleGoogleLogin,
        handleFacebookLogin,
    };
};
