import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiClient from '@/api/axios/apiClient';

// Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            name: string;
            email: string;
            avatar?: string;
            role: string;
            isEmailVerified: boolean;
            createdAt: string;
            updatedAt: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}

// Auth API
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        prepareHeaders: (headers) => {
            // Add any default headers here
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        // Login
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Register
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Forgot Password
        forgotPassword: builder.mutation<
            ForgotPasswordResponse,
            ForgotPasswordRequest
        >({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),

        // Reset Password
        resetPassword: builder.mutation<
            ResetPasswordResponse,
            ResetPasswordRequest
        >({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),

        // Refresh Token
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
        }),

        // Logout
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),

        // Get Current User
        getCurrentUser: builder.query<AuthResponse, void>({
            query: () => '/auth/me',
            providesTags: ['Auth'],
        }),

        // Verify Email
        verifyEmail: builder.mutation<AuthResponse, { token: string }>({
            query: ({ token }) => ({
                url: `/auth/verify-email?token=${token}`,
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),

        // Resend Verification Email
        resendVerificationEmail: builder.mutation<
            ForgotPasswordResponse,
            { email: string }
        >({
            query: (data) => ({
                url: '/auth/resend-verification',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

// Export hooks
export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useVerifyEmailMutation,
    useResendVerificationEmailMutation,
} = authApi;

// Custom API functions using apiClient
export const authApiClient = {
    // Login
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/login',
            credentials
        );
        return response.data;
    },

    // Register
    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/auth/register',
            userData
        );
        return response.data;
    },

    // Forgot Password
    forgotPassword: async (
        data: ForgotPasswordRequest
    ): Promise<ForgotPasswordResponse> => {
        const response = await apiClient.post<ForgotPasswordResponse>(
            '/auth/forgot-password',
            data
        );
        return response.data;
    },

    // Reset Password
    resetPassword: async (
        data: ResetPasswordRequest
    ): Promise<ResetPasswordResponse> => {
        const response = await apiClient.post<ResetPasswordResponse>(
            '/auth/reset-password',
            data
        );
        return response.data;
    },

    // Refresh Token
    refreshToken: async (): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<RefreshTokenResponse>(
            '/auth/refresh'
        );
        return response.data;
    },

    // Logout
    logout: async (): Promise<LogoutResponse> => {
        const response = await apiClient.post<LogoutResponse>('/auth/logout');
        return response.data;
    },

    // Get Current User
    getCurrentUser: async (): Promise<AuthResponse> => {
        const response = await apiClient.get<AuthResponse>('/auth/me');
        return response.data;
    },

    // Verify Email
    verifyEmail: async (token: string): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            `/auth/verify-email?token=${token}`
        );
        return response.data;
    },

    // Resend Verification Email
    resendVerificationEmail: async (
        email: string
    ): Promise<ForgotPasswordResponse> => {
        const response = await apiClient.post<ForgotPasswordResponse>(
            '/auth/resend-verification',
            { email }
        );
        return response.data;
    },
};
