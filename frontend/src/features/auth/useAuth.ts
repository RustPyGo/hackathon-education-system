import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import {
    loginAsync,
    registerAsync,
    forgotPasswordAsync,
    resetPasswordAsync,
    refreshTokenAsync,
    logoutAsync,
    getCurrentUserAsync,
    verifyEmailAsync,
    clearError,
    updateUser,
    clearAuth,
    initializeAuth,
    selectAuth,
    selectUser,
    selectIsAuthenticated,
    selectIsLoading,
    selectError,
    selectAccessToken,
    selectRefreshToken,
    selectIsEmailVerified,
    type User,
} from './authSlice';
import type {
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
} from './authApi';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Selectors
    const auth = useSelector(selectAuth);
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);
    const accessToken = useSelector(selectAccessToken);
    const refreshToken = useSelector(selectRefreshToken);
    const isEmailVerified = useSelector(selectIsEmailVerified);

    // Actions
    const login = useCallback(
        async (credentials: LoginRequest) => {
            const result = await dispatch(loginAsync(credentials));
            return result;
        },
        [dispatch]
    );

    const register = useCallback(
        async (userData: RegisterRequest) => {
            const result = await dispatch(registerAsync(userData));
            return result;
        },
        [dispatch]
    );

    const forgotPassword = useCallback(
        async (data: ForgotPasswordRequest) => {
            const result = await dispatch(forgotPasswordAsync(data));
            return result;
        },
        [dispatch]
    );

    const resetPassword = useCallback(
        async (data: ResetPasswordRequest) => {
            const result = await dispatch(resetPasswordAsync(data));
            return result;
        },
        [dispatch]
    );

    const refreshTokenAction = useCallback(async () => {
        const result = await dispatch(refreshTokenAsync());
        return result;
    }, [dispatch]);

    const logout = useCallback(async () => {
        const result = await dispatch(logoutAsync());
        return result;
    }, [dispatch]);

    const getCurrentUser = useCallback(async () => {
        const result = await dispatch(getCurrentUserAsync());
        return result;
    }, [dispatch]);

    const verifyEmail = useCallback(
        async (token: string) => {
            const result = await dispatch(verifyEmailAsync(token));
            return result;
        },
        [dispatch]
    );

    const clearErrorAction = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const updateUserAction = useCallback(
        (userData: Partial<User>) => {
            dispatch(updateUser(userData));
        },
        [dispatch]
    );

    const clearAuthAction = useCallback(() => {
        dispatch(clearAuth());
    }, [dispatch]);

    const initializeAuthAction = useCallback(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    return {
        // State
        user,
        isAuthenticated,
        isLoading,
        error,
        accessToken,
        refreshToken,
        isEmailVerified,
        auth,

        // Actions
        login,
        register,
        forgotPassword,
        resetPassword,
        refreshTokenAction,
        logout,
        getCurrentUser,
        verifyEmail,
        clearError: clearErrorAction,
        updateUser: updateUserAction,
        clearAuth: clearAuthAction,
        initializeAuth: initializeAuthAction,
    };
};
