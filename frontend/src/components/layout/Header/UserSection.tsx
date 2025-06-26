import React from 'react';
import { User, Bell, Settings } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { User as UserType } from '@/features/auth';
import { NOTIFICATION_COUNT } from './constants';

interface UserSectionProps {
    user: UserType | null;
    isLoggedIn: boolean;
    onLoginClick: () => void;
    className?: string;
}

const UserSection: React.FC<UserSectionProps> = ({
    user,
    isLoggedIn,
    onLoginClick,
    className = '',
}) => {
    return (
        <div className={`flex items-center space-x-4 ${className}`}>
            {/* Notifications - Only show when logged in */}
            {isLoggedIn && (
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {NOTIFICATION_COUNT}
                    </span>
                </button>
            )}

            {/* Settings - Only show when logged in */}
            {isLoggedIn && (
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            )}

            {/* User Avatar & Dropdown or Login Button */}
            {isLoggedIn ? (
                <div className="relative">
                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-gray-700">
                            {user?.name}
                        </span>
                    </button>
                </div>
            ) : (
                <Button
                    mode="contained"
                    colorScheme="primary"
                    size="small"
                    onClick={onLoginClick}
                    className="hidden sm:flex"
                >
                    Đăng nhập
                </Button>
            )}
        </div>
    );
};

export default UserSection;
