import React from 'react';
import Modal from 'react-modal';
import { FormProvider } from 'react-hook-form';
import ModalHeader from './ModalHeader';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import SocialLogin from './SocialLogin';
import TabLinks from './TabLinks';
import { useAuthModal } from './hooks';
import type { AuthModalProps } from './types';

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    defaultTab = 'login',
}) => {
    const {
        activeTab,
        isLoading,
        loginForm,
        registerForm,
        forgotPasswordForm,
        switchTab,
        handleLogin,
        handleRegister,
        handleForgotPassword,
        handleGoogleLogin,
        handleFacebookLogin,
    } = useAuthModal(defaultTab);

    const handleClose = () => {
        onClose();
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'login':
                return (
                    <FormProvider {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                            <LoginForm
                                isLoading={isLoading}
                                onForgotPassword={() =>
                                    switchTab('forgot-password')
                                }
                            />
                        </form>
                        <SocialLogin
                            onGoogleLogin={handleGoogleLogin}
                            onFacebookLogin={handleFacebookLogin}
                            isLoading={isLoading}
                        />
                    </FormProvider>
                );
            case 'register':
                return (
                    <FormProvider {...registerForm}>
                        <form
                            onSubmit={registerForm.handleSubmit(handleRegister)}
                        >
                            <RegisterForm isLoading={isLoading} />
                        </form>
                        <SocialLogin
                            onGoogleLogin={handleGoogleLogin}
                            onFacebookLogin={handleFacebookLogin}
                            isLoading={isLoading}
                        />
                    </FormProvider>
                );
            case 'forgot-password':
                return (
                    <FormProvider {...forgotPasswordForm}>
                        <form
                            onSubmit={forgotPasswordForm.handleSubmit(
                                handleForgotPassword
                            )}
                        >
                            <ForgotPasswordForm
                                isLoading={isLoading}
                                onBackToLogin={() => switchTab('login')}
                            />
                        </form>
                    </FormProvider>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40"
            contentLabel="Auth Modal"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
                {/* Header with Tabs */}
                <ModalHeader
                    activeTab={activeTab}
                    onClose={handleClose}
                    onTabChange={switchTab}
                    isLoading={isLoading}
                />

                {/* Content */}
                <div className="p-6">
                    {renderForm()}

                    {/* Tab Links */}
                    <TabLinks
                        activeTab={activeTab}
                        onTabChange={switchTab}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AuthModal;
