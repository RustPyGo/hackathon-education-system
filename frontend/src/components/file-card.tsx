import { FileText } from 'lucide-react';
import React from 'react';
import { Card } from './ui/card';

interface FileCardProps {
    label?: string;
    url?: string;
}

export const FileCard: React.FC<FileCardProps> = ({ label = 'File', url }) => {
    const handleClick = () => {
        if (url) {
            window.open(url, '_blank');
        }
    };
    return (
        <Card
            className="flex flex-row items-center gap-2 p-2 w-36 cursor-pointer hover:shadow-md transition-shadow min-w-32"
            onClick={handleClick}
        >
            <div className="bg-pink-100 rounded-full p-1.5 flex items-center justify-center">
                <FileText className="text-pink-500 w-5 h-5" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-xs text-gray-900 truncate">
                    {label}
                </span>
                <span className="text-[10px] text-gray-500">PDF</span>
            </div>
        </Card>
    );
};
