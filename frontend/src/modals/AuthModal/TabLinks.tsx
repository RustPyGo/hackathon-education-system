import React from 'react';
import {
    HAVE_ACCOUNT_TEXT,
    NO_ACCOUNT_TEXT,
    LOGIN_LINK_TEXT,
    REGISTER_LINK_TEXT,
} from './constants';
import type { AuthTab } from './types';

interface TabLinksProps {
    activeTab: AuthTab;
    onTabChange: (tab: AuthTab) => void;
    isLoading?: boolean;
    className?: string;
}

const TabLinks: React.FC<TabLinksProps> = ({
    activeTab,
    onTabChange,
    isLoading = false,
    className = '',
}) => {
    if (activeTab === 'forgot-password') {
        return null; // Don't show links for forgot password tab
    }

    return (
        <div className={`mt-6 text-center ${className}`}>
            {activeTab === 'login' ? (
                <div>
                    <span className="text-sm text-gray-600">
                        {NO_ACCOUNT_TEXT}{' '}
                    </span>
                    <button
                        type="button"
                        className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
                        onClick={() => onTabChange('register')}
                        disabled={isLoading}
                    >
                        {REGISTER_LINK_TEXT}
                    </button>
                </div>
            ) : (
                <div>
                    <span className="text-sm text-gray-600">
                        {HAVE_ACCOUNT_TEXT}{' '}
                    </span>
                    <button
                        type="button"
                        className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
                        onClick={() => onTabChange('login')}
                        disabled={isLoading}
                    >
                        {LOGIN_LINK_TEXT}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TabLinks;
