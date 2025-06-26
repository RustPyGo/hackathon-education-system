import React, { useState } from 'react';
import { useAuthContext } from './AuthContext';
import Button from '@/components/ui/Button';

export const AuthContextDemo: React.FC = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        isCheckingAuth,
        error,
        login,
        register,
        logout,
        forgotPassword,
        clearError,
    } = useAuthContext();

    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password123');
    const [name, setName] = useState('Test User');

    const handleLogin = async () => {
        const success = await login(email, password);
        if (success) {
            console.log('Login successful');
        } else {
            console.log('Login failed');
        }
    };

    const handleRegister = async () => {
        const success = await register(name, email, password);
        if (success) {
            console.log('Registration successful');
        } else {
            console.log('Registration failed');
        }
    };

    const handleLogout = async () => {
        await logout();
        console.log('Logged out');
    };

    const handleForgotPassword = async () => {
        const success = await forgotPassword(email);
        if (success) {
            console.log('Forgot password email sent');
        } else {
            console.log('Forgot password failed');
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">AuthContext Demo</h2>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">
                        Checking authentication status...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">AuthContext Demo</h2>

            {/* Status Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Authentication Status:</h3>
                <div className="space-y-1 text-sm">
                    <p>
                        <span className="font-medium">Authenticated:</span>{' '}
                        {isAuthenticated ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <span className="font-medium">Loading:</span>{' '}
                        {isLoading ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <span className="font-medium">Checking Auth:</span>{' '}
                        {isCheckingAuth ? 'Yes' : 'No'}
                    </p>
                    {user && (
                        <div>
                            <p>
                                <span className="font-medium">User:</span>{' '}
                                {user.name} ({user.email})
                            </p>
                            <p>
                                <span className="font-medium">Role:</span>{' '}
                                {user.role}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Email Verified:
                                </span>{' '}
                                {user.isEmailVerified ? 'Yes' : 'No'}
                            </p>
                        </div>
                    )}
                    {error && (
                        <p className="text-red-600">
                            <span className="font-medium">Error:</span> {error}
                        </p>
                    )}
                </div>
            </div>

            {/* Login Form */}
            {!isAuthenticated && (
                <div className="mb-6">
                    <h3 className="font-medium mb-3">Login/Register</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <div className="flex space-x-2">
                            <Button
                                onClick={handleLogin}
                                disabled={isLoading}
                                mode="contained"
                                colorScheme="primary"
                                size="small"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                            <Button
                                onClick={handleRegister}
                                disabled={isLoading}
                                mode="contained"
                                colorScheme="secondary"
                                size="small"
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </Button>
                            <Button
                                onClick={handleForgotPassword}
                                disabled={isLoading}
                                mode="outlined"
                                colorScheme="primary"
                                size="small"
                            >
                                Forgot Password
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout */}
            {isAuthenticated && (
                <div className="mb-6">
                    <h3 className="font-medium mb-3">User Actions</h3>
                    <Button
                        onClick={handleLogout}
                        disabled={isLoading}
                        mode="contained"
                        colorScheme="error"
                        size="small"
                    >
                        {isLoading ? 'Logging out...' : 'Logout'}
                    </Button>
                </div>
            )}

            {/* Clear Error */}
            {error && (
                <div className="mb-6">
                    <Button
                        onClick={clearError}
                        mode="outlined"
                        colorScheme="primary"
                        size="small"
                    >
                        Clear Error
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AuthContextDemo;
