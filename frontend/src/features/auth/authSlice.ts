import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApiClient } from './authApi';
import type {
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
} from './authApi';

// Types
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isEmailVerified: boolean;
}

// Async thunks
export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authApiClient.login(credentials);
            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Login failed');
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'Login failed';
            return rejectWithValue(errorMessage);
        }
    }
);

export const registerAsync = createAsyncThunk(
    'auth/register',
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await authApiClient.register(userData);
            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(
                    response.message || 'Registration failed'
                );
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'Registration failed';
            return rejectWithValue(errorMessage);
        }
    }
);

export const forgotPasswordAsync = createAsyncThunk(
    'auth/forgotPassword',
    async (data: ForgotPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await authApiClient.forgotPassword(data);
            if (response.success) {
                return response.message;
            } else {
                return rejectWithValue(
                    response.message || 'Failed to send reset email'
                );
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to send reset email';
            return rejectWithValue(errorMessage);
        }
    }
);

export const resetPasswordAsync = createAsyncThunk(
    'auth/resetPassword',
    async (data: ResetPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await authApiClient.resetPassword(data);
            if (response.success) {
                return response.message;
            } else {
                return rejectWithValue(
                    response.message || 'Failed to reset password'
                );
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to reset password';
            return rejectWithValue(errorMessage);
        }
    }
);

export const refreshTokenAsync = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { auth: AuthState };
            const currentRefreshToken = state.auth.refreshToken;

            if (!currentRefreshToken) {
                return rejectWithValue('No refresh token available');
            }

            const response = await authApiClient.refreshToken();
            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(
                    response.message || 'Token refresh failed'
                );
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'Token refresh failed';
            return rejectWithValue(errorMessage);
        }
    }
);

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApiClient.logout();
            if (response.success) {
                return response.message;
            } else {
                return rejectWithValue(response.message || 'Logout failed');
            }
        } catch (error: unknown) {
            // Even if logout API fails, we should clear local state
            console.error('Logout API error:', error);
            return 'Logged out successfully';
        }
    }
);

export const getCurrentUserAsync = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApiClient.getCurrentUser();
            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(
                    response.message || 'Failed to get user data'
                );
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to get user data';
            return rejectWithValue(errorMessage);
        }
    }
);

export const verifyEmailAsync = createAsyncThunk(
    'auth/verifyEmail',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await authApiClient.verifyEmail(token);
            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(
                    response.message || 'Email verification failed'
                );
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Email verification failed';
            return rejectWithValue(errorMessage);
        }
    }
);

// Initial state
const initialState: AuthState = {
    user: null,
    accessToken: null, // Don't read from localStorage since tokens are in httpOnly cookies
    refreshToken: null, // Don't read from localStorage since tokens are in httpOnly cookies
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isEmailVerified: false,
};

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set loading
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Update user
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },

        // Set tokens manually (for testing or special cases)
        setTokens: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            // Don't save to localStorage since tokens are in httpOnly cookies
        },

        // Clear auth state (for logout)
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isEmailVerified = false;
            // Don't remove from localStorage since tokens are in httpOnly cookies
        },

        // Initialize auth - just set loading state, actual auth check will be done via getCurrentUser API
        initializeAuth: () => {
            // Don't try to read tokens from localStorage since they're in httpOnly cookies
            // The actual authentication check will be done by calling getCurrentUser API
            // This reducer just sets up the initial state
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                state.isEmailVerified = action.payload.user.isEmailVerified;
                // Don't save to localStorage since tokens are in httpOnly cookies
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(registerAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                state.isEmailVerified = action.payload.user.isEmailVerified;
                // Don't save to localStorage since tokens are in httpOnly cookies
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Forgot Password
        builder
            .addCase(forgotPasswordAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPasswordAsync.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(forgotPasswordAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Reset Password
        builder
            .addCase(resetPasswordAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPasswordAsync.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Refresh Token
        builder
            .addCase(refreshTokenAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(refreshTokenAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                // Don't update localStorage since tokens are in httpOnly cookies
            })
            .addCase(refreshTokenAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                // Clear auth state on refresh failure
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.isEmailVerified = false;
                // Don't remove from localStorage since tokens are in httpOnly cookies
            });

        // Logout
        builder
            .addCase(logoutAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.isEmailVerified = false;
                // Don't remove from localStorage since tokens are in httpOnly cookies
            })
            .addCase(logoutAsync.rejected, (state) => {
                state.isLoading = false;
                // Clear auth state even if logout API fails
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.isEmailVerified = false;
                // Don't remove from localStorage since tokens are in httpOnly cookies
            });

        // Get Current User
        builder
            .addCase(getCurrentUserAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.isEmailVerified = action.payload.user.isEmailVerified;
            })
            .addCase(getCurrentUserAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                // Clear auth state if getting user fails
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.isEmailVerified = false;
                // Don't remove from localStorage since tokens are in httpOnly cookies
            });

        // Verify Email
        builder
            .addCase(verifyEmailAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyEmailAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isEmailVerified = action.payload.user.isEmailVerified;
            })
            .addCase(verifyEmailAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// Export actions
export const {
    clearError,
    setLoading,
    updateUser,
    setTokens,
    clearAuth,
    initializeAuth,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
    state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
    state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectAccessToken = (state: { auth: AuthState }) =>
    state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) =>
    state.auth.refreshToken;
export const selectIsEmailVerified = (state: { auth: AuthState }) =>
    state.auth.isEmailVerified;

// Export reducer
export default authSlice.reducer;
