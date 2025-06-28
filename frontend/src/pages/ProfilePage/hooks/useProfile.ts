import type { UserProfile, LearningProgress, StudySession } from '../mockData';
import { useState, useMemo } from 'react';

interface UseProfileProps {
    userProfile: UserProfile;
    learningProgress: LearningProgress[];
    studySessions: StudySession[];
}

export const useProfile = ({
    userProfile,
    learningProgress,
    studySessions,
}: UseProfileProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<
        'overview' | 'progress' | 'sessions' | 'settings'
    >('overview');
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${remainingMinutes}m`;
    };

    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    };

    const getLevelProgress = () => {
        const progress =
            (userProfile.statistics.experience /
                userProfile.statistics.nextLevelExperience) *
            100;
        return Math.min(progress, 100);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreMessage = (score: number) => {
        if (score >= 90) return 'Excellent!';
        if (score >= 80) return 'Great job!';
        if (score >= 70) return 'Good work!';
        if (score >= 60) return 'Not bad!';
        return 'Keep practicing!';
    };

    const filteredProgress = useMemo(() => {
        if (!selectedSubject) return learningProgress;
        return learningProgress.filter(
            (progress) => progress.subject === selectedSubject
        );
    }, [learningProgress, selectedSubject]);

    const filteredSessions = useMemo(() => {
        if (!selectedSubject) return studySessions;
        return studySessions.filter(
            (session) => session.subject === selectedSubject
        );
    }, [studySessions, selectedSubject]);

    const subjects = useMemo(() => {
        const progressSubjects = learningProgress.map((p) => p.subject);
        const sessionSubjects = studySessions.map((s) => s.subject);
        return [...new Set([...progressSubjects, ...sessionSubjects])];
    }, [learningProgress, studySessions]);

    const totalStudyTime = useMemo(() => {
        return studySessions.reduce(
            (total, session) => total + session.duration,
            0
        );
    }, [studySessions]);

    const averageSessionDuration = useMemo(() => {
        if (studySessions.length === 0) return 0;
        return Math.round(totalStudyTime / studySessions.length);
    }, [studySessions, totalStudyTime]);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = () => {
        setIsEditing(false);
        // Here you would typically save to backend
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleTabChange = (
        tab: 'overview' | 'progress' | 'sessions' | 'settings'
    ) => {
        setActiveTab(tab);
    };

    const handleSubjectFilter = (subject: string | null) => {
        setSelectedSubject(subject);
    };

    return {
        isEditing,
        activeTab,
        selectedSubject,
        subjects,
        filteredProgress,
        filteredSessions,
        totalStudyTime,
        averageSessionDuration,
        formatDate,
        formatTime,
        formatDuration,
        getLevelProgress,
        getScoreColor,
        getScoreMessage,
        handleEditProfile,
        handleSaveProfile,
        handleCancelEdit,
        handleTabChange,
        handleSubjectFilter,
    };
};
