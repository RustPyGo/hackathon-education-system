import React from 'react';
import { Card, CardContent } from './ui/card';

interface FeatureCardProps {
    icon: React.ReactNode;
    iconBgClass?: string;
    title: string;
    subtitle: string;
    className?: string;
}

const LandingPageCard: React.FC<FeatureCardProps> = ({
    icon,
    iconBgClass = 'bg-blue-100',
    title,
    subtitle,
    className = '',
}) => (
    <Card
        className={`text-center hover:shadow-lg transition-shadow ${className}`}
    >
        <CardContent className="pt-6">
            <div
                className={`${iconBgClass} p-3 rounded-full w-fit mx-auto mb-4`}
            >
                {icon}
            </div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
        </CardContent>
    </Card>
);

export default LandingPageCard;
