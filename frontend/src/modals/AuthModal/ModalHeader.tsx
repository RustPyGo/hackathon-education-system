import React from 'react';
import { X } from 'lucide-react';
import { MODAL_TITLE } from './constants';
import type { AuthTab } from './types';

interface ModalHeaderProps {
    activeTab: AuthTab;
    onClose: () => void;
    onTabChange: (tab: AuthTab) => void;
    isLoading?: boolean;
    className?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
    onClose,
    isLoading = false,
    className = '',
}) => {
    return (
        <div className={`border-b border-gray-200 ${className}`}>
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {MODAL_TITLE}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Tabs - Currently disabled */}
            {/* <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        disabled={isLoading}
                        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div> */}
        </div>
    );
};

export default ModalHeader;
