import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useAuthStatus = () => {
    const { getCurrentUser, isAuthenticated, user, isLoading, error } =
        useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsCheckingAuth(true);
                await getCurrentUser();
            } catch {
                // This is expected if user is not authenticated
                console.log('User not authenticated');
            } finally {
                setIsCheckingAuth(false);
            }
        };

        // Check auth status on mount
        checkAuthStatus();
    }, [getCurrentUser]);

    return {
        isAuthenticated,
        user,
        isLoading: isLoading || isCheckingAuth,
        error,
        isCheckingAuth,
    };
};
