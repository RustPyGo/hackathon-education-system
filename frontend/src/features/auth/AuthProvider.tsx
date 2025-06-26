import React from 'react';
import { useAuthStatus } from './useAuthStatus';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // This will automatically check auth status on mount
    useAuthStatus();

    return <>{children}</>;
};
