import React from 'react';
import { useAuthContext } from './AuthContext';

export const AuthContextTest: React.FC = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        isCheckingAuth,
        error,
        getCurrentUser,
    } = useAuthContext();

    const handleTestAuth = async () => {
        console.log('Testing auth...');
        try {
            const success = await getCurrentUser();
            console.log('Auth test result:', success);
        } catch (error) {
            console.error('Auth test error:', error);
        }
    };

    return (
        <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">AuthContext Test</h3>

            <div className="space-y-2 text-sm">
                <p>
                    <strong>isCheckingAuth:</strong>{' '}
                    {isCheckingAuth ? 'Yes' : 'No'}
                </p>
                <p>
                    <strong>isAuthenticated:</strong>{' '}
                    {isAuthenticated ? 'Yes' : 'No'}
                </p>
                <p>
                    <strong>isLoading:</strong> {isLoading ? 'Yes' : 'No'}
                </p>
                <p>
                    <strong>User:</strong>{' '}
                    {user ? `${user.name} (${user.email})` : 'None'}
                </p>
                {error && (
                    <p className="text-red-600">
                        <strong>Error:</strong> {error}
                    </p>
                )}
            </div>

            <button
                onClick={handleTestAuth}
                disabled={isLoading}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isLoading ? 'Testing...' : 'Test Auth'}
            </button>
        </div>
    );
};

export default AuthContextTest;
