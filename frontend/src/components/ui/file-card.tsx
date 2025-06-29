import { Card } from './card';
import { FileText } from 'lucide-react';
import React from 'react';

interface FileCardProps {
    label?: string;
}

export const FileCard: React.FC<FileCardProps> = ({ label = 'File' }) => {
    return (
        <Card className="flex items-center gap-4 p-4 w-64 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="bg-pink-100 rounded-full p-3">
                <FileText className="text-pink-500 w-8 h-8" />
            </div>
            <div className="flex flex-col">
                <span className="font-semibold text-base text-gray-900">
                    {label}
                </span>
                <span className="text-xs text-gray-500">PDF</span>
            </div>
        </Card>
    );
};
