import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/features/auth';
import type { User } from '@/features/auth';

// Auth Context Types
interface AuthContextType {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isCheckingAuth: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<boolean>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (
        token: string,
        password: string,
        confirmPassword: string
    ) => Promise<boolean>;
    refreshToken: () => Promise<boolean>;
    getCurrentUser: () => Promise<boolean>;
    verifyEmail: (token: string) => Promise<boolean>;
    clearError: () => void;
    updateUser: (userData: Partial<User>) => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
    children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        login: authLogin,
        register: authRegister,
        logout: authLogout,
        forgotPassword: authForgotPassword,
        resetPassword: authResetPassword,
        refreshTokenAction,
        getCurrentUser: authGetCurrentUser,
        verifyEmail: authVerifyEmail,
        clearError: authClearError,
        updateUser: authUpdateUser,
    } = useAuth();

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    console.log('user', user);
    // Check authentication status on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsCheckingAuth(true);
                await authGetCurrentUser();
            } catch (error) {
                // This is expected if user is not authenticated

                console.log('User not authenticated', error);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        // Check auth status when component mounts
        checkAuthStatus();
    }, [authGetCurrentUser]);

    // Wrapper functions for better error handling and user experience
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const result = await authLogin({ email, password });
            return result.meta.requestStatus === 'fulfilled';
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const register = async (
        name: string,
        email: string,
        password: string
    ): Promise<boolean> => {
        try {
            const result = await authRegister({ name, email, password });
            return result.meta.requestStatus === 'fulfilled';
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authLogout();
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout API fails, we should clear local state
        }
    };

    const forgotPassword = async (email: string): Promise<boolean> => {
        try {
            const result = await authForgotPassword({ email });
            return result.meta.requestStatus === 'fulfilled';
        } catch (error) {
            console.error('Forgot password failed:', error);
            return false;
        }
    };

    const resetPassword = async (
        token: string,
        password: string,
        confirmPassword: string
    ): Promise<boolean> => {
        try {
            const result = await authResetPassword({
                token,
                password,
                confirmPassword,
            });
            return result.meta.requestStatus === 'fulfilled';
        } catch (error) {
            console.error('Reset password failed:', error);
            return false;
        }
    };

    const refreshToken = async (): Promise<boolean> => {
        try {
            const result = await refreshTokenAction();
            return result.meta.requestStatus === 'fulfilled';
        } catch (error) {
            console.error('Refresh token failed:', error);
            return false;
        }
    };

    const getCurrentUser = async (): Promise<boolean> => {
        try {
            const result = await authGetCurrentUser();
            return result.meta.requestStatus === 'fulfilled';
        } catch (error) {
            console.error('Get current user failed:', error);
            return false;
        }
    };

    const verifyEmail = async (token: string): Promise<boolean> => {
        try {
            const result = await authVerifyEmail(token);
            return result.meta.requestStatus === 'fulfilled';
        } catch (error) {
            console.error('Email verification failed:', error);
            return false;
        }
    };

    const clearError = (): void => {
        authClearError();
    };

    const updateUser = (userData: Partial<User>): void => {
        authUpdateUser(userData);
    };

    // Context value
    const contextValue: AuthContextType = {
        // State
        user,
        isAuthenticated,
        isLoading,
        isCheckingAuth,
        error,

        // Actions
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        refreshToken,
        getCurrentUser,
        verifyEmail,
        clearError,
        updateUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

// Export default AuthContext for backward compatibility
export default AuthContext;
