import React, { useState } from 'react';
import Modal from 'react-modal';
import ModalHeader from './ModalHeader';
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';
import SignupLink from './SignupLink';
import { VALIDATION_MESSAGES } from './constants';
import type { LoginModalProps, LoginData, FormErrors } from './types';

const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onLogin,
    onGoogleLogin,
    onFacebookLogin,
}) => {
    const [formData, setFormData] = useState<LoginData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof LoginData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
        }

        if (!formData.password.trim()) {
            newErrors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
        } else if (formData.password.length < 6) {
            newErrors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await onLogin?.(formData);
            // Reset form on success
            setFormData({ email: '', password: '' });
            setErrors({});
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await onGoogleLogin?.();
        } catch (error) {
            console.error('Google login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsLoading(true);
        try {
            await onFacebookLogin?.();
        } catch (error) {
            console.error('Facebook login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: '', password: '' });
        setErrors({});
        setIsLoading(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40"
            contentLabel="Login Modal"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
                {/* Header */}
                <ModalHeader onClose={handleClose} isLoading={isLoading} />

                {/* Content */}
                <div className="p-6">
                    <LoginForm
                        formData={formData}
                        errors={errors}
                        isLoading={isLoading}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />

                    <SocialLogin
                        onGoogleLogin={handleGoogleLogin}
                        onFacebookLogin={handleFacebookLogin}
                        isLoading={isLoading}
                    />

                    <SignupLink isLoading={isLoading} />
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;
