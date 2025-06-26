import React from 'react';
import Button from '@/components/ui/Button';
import { useAuthModal } from './index';
import AuthModal from './index';

const AuthModalDemo = () => {
    const { isOpen, openModal, closeModal } = useAuthModal();

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                AuthModal Component Demo (React Hook Form)
            </h1>

            {/* Open Modal Buttons */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Open Modal
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Button
                        mode="contained"
                        colorScheme="primary"
                        onClick={() => openModal('login')}
                    >
                        Open Login Modal
                    </Button>
                    <Button
                        mode="contained"
                        colorScheme="secondary"
                        onClick={() => openModal('register')}
                    >
                        Open Register Modal
                    </Button>
                    <Button
                        mode="contained"
                        colorScheme="error"
                        onClick={() => openModal('forgot-password')}
                    >
                        Open Forgot Password Modal
                    </Button>
                </div>
            </section>

            {/* React Hook Form Features */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    React Hook Form Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <h3 className="font-semibold text-lg mb-2">
                            Form Management
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Automatic form state management</li>
                            <li>• Built-in validation with Yup</li>
                            <li>• Real-time validation</li>
                            <li>• Form reset on close</li>
                            <li>• Error handling</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <h3 className="font-semibold text-lg mb-2">
                            Performance
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Optimized re-renders</li>
                            <li>• Controlled inputs</li>
                            <li>• Debounced validation</li>
                            <li>• Memory efficient</li>
                            <li>• Fast form switching</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <h3 className="font-semibold text-lg mb-2">
                            Developer Experience
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• TypeScript support</li>
                            <li>• Form context</li>
                            <li>• Easy validation rules</li>
                            <li>• Clean API</li>
                            <li>• Debug tools</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Form Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <h3 className="font-semibold text-lg mb-2">Login</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Email validation (Yup)</li>
                            <li>• Password validation (Yup)</li>
                            <li>• Show/hide password</li>
                            <li>• Forgot password link</li>
                            <li>• Social login (Google, Facebook)</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <h3 className="font-semibold text-lg mb-2">Register</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Name validation (Yup)</li>
                            <li>• Email validation (Yup)</li>
                            <li>• Password validation (Yup)</li>
                            <li>• Confirm password (Yup)</li>
                            <li>• Social login (Google, Facebook)</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow border">
                        <h3 className="font-semibold text-lg mb-2">
                            Forgot Password
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Email validation (Yup)</li>
                            <li>• Send reset link</li>
                            <li>• Back to login</li>
                            <li>• Success message</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* API Integration Points */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    API Integration Points
                </h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4">
                        API Endpoints to Implement:
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="bg-white p-3 rounded border">
                            <code className="text-blue-600">
                                POST /api/auth/login
                            </code>
                            <p className="text-gray-600 mt-1">
                                Login with email and password (form data passed
                                automatically)
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <code className="text-blue-600">
                                POST /api/auth/register
                            </code>
                            <p className="text-gray-600 mt-1">
                                Register new user (form data passed
                                automatically)
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <code className="text-blue-600">
                                POST /api/auth/forgot-password
                            </code>
                            <p className="text-gray-600 mt-1">
                                Send password reset email (form data passed
                                automatically)
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <code className="text-blue-600">
                                Google OAuth Integration
                            </code>
                            <p className="text-gray-600 mt-1">
                                Implement Google login
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <code className="text-blue-600">
                                Facebook OAuth Integration
                            </code>
                            <p className="text-gray-600 mt-1">
                                Implement Facebook login
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AuthModal Component */}
            <AuthModal
                isOpen={isOpen}
                onClose={closeModal}
                defaultTab="login"
            />
        </div>
    );
};

export default AuthModalDemo;
