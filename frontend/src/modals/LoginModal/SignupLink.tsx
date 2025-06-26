import React from 'react';
import { SIGNUP_TEXT, SIGNUP_LINK_TEXT } from './constants';

interface SignupLinkProps {
    isLoading?: boolean;
    className?: string;
}

const SignupLink: React.FC<SignupLinkProps> = ({
    isLoading = false,
    className = '',
}) => {
    return (
        <div className={`mt-6 text-center ${className}`}>
            <span className="text-sm text-gray-600">{SIGNUP_TEXT} </span>
            <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
                disabled={isLoading}
            >
                {SIGNUP_LINK_TEXT}
            </button>
        </div>
    );
};

export default SignupLink;
