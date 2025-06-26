// Export API
export { authApi, authApiClient } from './authApi';
export type {
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    RefreshTokenResponse,
    ForgotPasswordResponse,
    ResetPasswordResponse,
    LogoutResponse,
} from './authApi';

// Export Slice
export { default as authReducer } from './authSlice';
export {
    loginAsync,
    registerAsync,
    forgotPasswordAsync,
    resetPasswordAsync,
    refreshTokenAsync,
    logoutAsync,
    getCurrentUserAsync,
    verifyEmailAsync,
    clearError,
    setLoading,
    updateUser,
    setTokens,
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
} from './authSlice';
export type { User, AuthState } from './authSlice';

// Export Hooks
export { useAuth } from './useAuth';
export { useAuthStatus } from './useAuthStatus';

// Export Provider
export { AuthProvider } from './AuthProvider';

// Export Demo
export { default as AuthDemo } from './AuthDemo';
