import React from 'react';
import { X } from 'lucide-react';
import { MODAL_TITLE } from './constants';

interface ModalHeaderProps {
    onClose: () => void;
    isLoading?: boolean;
    className?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
    onClose,
    isLoading = false,
    className = '',
}) => {
    return (
        <div
            className={`flex items-center justify-between p-6 border-b border-gray-200 ${className}`}
        >
            <h2 className="text-2xl font-bold text-gray-900">{MODAL_TITLE}</h2>
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading}
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>
    );
};

export default ModalHeader;
