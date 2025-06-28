import {
    ProfileHeader,
    Statistics,
    ProgressHistory,
    StudySessions,
    ProfileTabs,
} from './components';
import { useProfile } from './hooks/useProfile';
import {
    mockUserProfile,
    mockLearningProgress,
    mockStudySessions,
} from './mockData';

const ProfilePage = () => {
    const {
        isEditing,
        activeTab,
        selectedSubject,
        subjects,
        filteredProgress,
        filteredSessions,
        formatDate,
        formatTime,
        formatDuration,
        getLevelProgress,
        getScoreColor,
        handleEditProfile,
        handleSaveProfile,
        handleCancelEdit,
        handleTabChange,
        handleSubjectFilter,
    } = useProfile({
        userProfile: mockUserProfile,
        learningProgress: mockLearningProgress,
        studySessions: mockStudySessions,
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <Statistics
                            statistics={mockUserProfile.statistics}
                            getLevelProgress={getLevelProgress}
                            formatTime={formatTime}
                        />
                    </div>
                );
            case 'progress':
                return (
                    <ProgressHistory
                        progress={filteredProgress}
                        subjects={subjects}
                        selectedSubject={selectedSubject}
                        formatDate={formatDate}
                        formatDuration={formatDuration}
                        getScoreColor={getScoreColor}
                        onSubjectFilter={handleSubjectFilter}
                    />
                );
            case 'sessions':
                return (
                    <StudySessions
                        sessions={filteredSessions}
                        subjects={subjects}
                        selectedSubject={selectedSubject}
                        formatTime={formatTime}
                        onSubjectFilter={handleSubjectFilter}
                    />
                );
            case 'settings':
                return (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Settings
                        </h2>
                        <p className="text-gray-600">
                            Settings functionality will be implemented here.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <ProfileHeader
                    userProfile={mockUserProfile}
                    isEditing={isEditing}
                    formatDate={formatDate}
                    onEdit={handleEditProfile}
                    onSave={handleSaveProfile}
                    onCancel={handleCancelEdit}
                />

                {/* Tabs Navigation */}
                <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ProfilePage;
