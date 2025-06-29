"use client";

import React from 'react';
import { Card, CardContent } from './ui/card';

interface FeatureCardProps {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    iconBg,
    title,
    subtitle,
}) => (
    <Card className="text-center hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
            <div className={`${iconBg} p-3 rounded-full w-fit mx-auto mb-4`}>
                {icon}
            </div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
        </CardContent>
    </Card>
);

export default FeatureCard;
