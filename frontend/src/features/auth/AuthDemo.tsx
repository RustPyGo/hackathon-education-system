import React, { useState } from 'react';
import { useAuth } from './useAuth';
import Button from '@/components/ui/Button';

const AuthDemo: React.FC = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        isEmailVerified,
        login,
        register,
        logout,
        forgotPassword,
        clearError,
    } = useAuth();

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [forgotEmail, setForgotEmail] = useState('');

    const handleLogin = async () => {
        try {
            const result = await login(loginData);
            if (result.meta.requestStatus === 'fulfilled') {
                console.log('Login successful:', result.payload);
            } else {
                console.error('Login failed:', result.payload);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleRegister = async () => {
        try {
            const result = await register(registerData);
            if (result.meta.requestStatus === 'fulfilled') {
                console.log('Register successful:', result.payload);
            } else {
                console.error('Register failed:', result.payload);
            }
        } catch (error) {
            console.error('Register error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.meta.requestStatus === 'fulfilled') {
                console.log('Logout successful');
            } else {
                console.error('Logout failed:', result.payload);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleForgotPassword = async () => {
        try {
            const result = await forgotPassword({ email: forgotEmail });
            if (result.meta.requestStatus === 'fulfilled') {
                console.log('Forgot password successful:', result.payload);
            } else {
                console.error('Forgot password failed:', result.payload);
            }
        } catch (error) {
            console.error('Forgot password error:', error);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Auth System Demo
            </h1>

            {/* Status */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
                <div className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Authenticated:</span>{' '}
                        <span
                            className={
                                isAuthenticated
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }
                        >
                            {isAuthenticated ? 'Yes' : 'No'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium">Loading:</span>{' '}
                        <span
                            className={
                                isLoading ? 'text-yellow-600' : 'text-gray-600'
                            }
                        >
                            {isLoading ? 'Yes' : 'No'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium">Email Verified:</span>{' '}
                        <span
                            className={
                                isEmailVerified
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }
                        >
                            {isEmailVerified ? 'Yes' : 'No'}
                        </span>
                    </p>
                    {user && (
                        <div>
                            <p className="font-medium">User:</p>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(user, null, 2)}
                            </pre>
                        </div>
                    )}
                    {error && (
                        <div>
                            <p className="font-medium text-red-600">Error:</p>
                            <p className="text-red-600">{error}</p>
                            <Button
                                mode="outlined"
                                colorScheme="error"
                                size="sm"
                                onClick={clearError}
                            >
                                Clear Error
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Login Form */}
            {!isAuthenticated && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-xl font-semibold mb-4">Login</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={loginData.email}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                placeholder="Enter email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                placeholder="Enter password"
                            />
                        </div>
                        <Button
                            mode="contained"
                            colorScheme="primary"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Register Form */}
            {!isAuthenticated && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-xl font-semibold mb-4">Register</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={registerData.name}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                placeholder="Enter name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={registerData.email}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                placeholder="Enter email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={registerData.password}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                placeholder="Enter password"
                            />
                        </div>
                        <Button
                            mode="contained"
                            colorScheme="secondary"
                            onClick={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Forgot Password */}
            {!isAuthenticated && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-xl font-semibold mb-4">
                        Forgot Password
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Enter email"
                            />
                        </div>
                        <Button
                            mode="outlined"
                            colorScheme="primary"
                            onClick={handleForgotPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Email'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Logout */}
            {isAuthenticated && (
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h2 className="text-xl font-semibold mb-4">Logout</h2>
                    <Button
                        mode="contained"
                        colorScheme="error"
                        onClick={handleLogout}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging out...' : 'Logout'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AuthDemo;
