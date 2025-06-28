import { User, BarChart3, BookOpen, Settings } from 'lucide-react';

interface ProfileTabsProps {
    activeTab: 'overview' | 'progress' | 'sessions' | 'settings';
    onTabChange: (
        tab: 'overview' | 'progress' | 'sessions' | 'settings'
    ) => void;
}

const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
    const tabs = [
        {
            id: 'overview' as const,
            label: 'Overview',
            icon: User,
        },
        {
            id: 'progress' as const,
            label: 'Progress',
            icon: BarChart3,
        },
        {
            id: 'sessions' as const,
            label: 'Study Sessions',
            icon: BookOpen,
        },
        {
            id: 'settings' as const,
            label: 'Settings',
            icon: Settings,
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default ProfileTabs;
