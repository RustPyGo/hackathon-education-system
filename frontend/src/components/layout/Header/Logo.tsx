import React from 'react';
import { BookOpen } from 'lucide-react';
import { BRAND_NAME } from './constants';

const Logo: React.FC = () => {
    return (
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                        {BRAND_NAME}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Logo;
