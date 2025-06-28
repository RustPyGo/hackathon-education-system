export interface UserProfile {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatar?: string;
    bio?: string;
    joinDate: string;
    lastActive: string;
    preferences: UserPreferences;
    statistics: UserStatistics;
}

export interface UserPreferences {
    emailNotifications: boolean;
    pushNotifications: boolean;
    studyReminders: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
}

export interface UserStatistics {
    totalQuizzes: number;
    totalQuestions: number;
    correctAnswers: number;
    averageScore: number;
    studyTime: number; // in minutes
    streakDays: number;
    level: number;
    experience: number;
    nextLevelExperience: number;
}

export interface LearningProgress {
    id: string;
    quizTitle: string;
    subject: string;
    completedAt: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number; // in seconds
    skillBreakdown: SkillProgress[];
}

export interface SkillProgress {
    skill: string;
    questions: number;
    correct: number;
    percentage: number;
}

export interface StudySession {
    id: string;
    date: string;
    duration: number; // in minutes
    subject: string;
    topics: string[];
    questionsAnswered: number;
    correctAnswers: number;
}

export const mockUserProfile: UserProfile = {
    id: 'user-001',
    username: 'john_doe',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate learner focused on JavaScript and web development. Always eager to improve my skills!',
    joinDate: '2024-01-01T00:00:00Z',
    lastActive: '2024-01-15T10:30:00Z',
    preferences: {
        emailNotifications: true,
        pushNotifications: false,
        studyReminders: true,
        theme: 'light',
        language: 'en',
        timezone: 'Asia/Ho_Chi_Minh',
    },
    statistics: {
        totalQuizzes: 25,
        totalQuestions: 500,
        correctAnswers: 375,
        averageScore: 75,
        studyTime: 1800, // 30 hours
        streakDays: 7,
        level: 5,
        experience: 1250,
        nextLevelExperience: 1500,
    },
};

export const mockLearningProgress: LearningProgress[] = [
    {
        id: 'progress-001',
        quizTitle: 'JavaScript Fundamentals Quiz',
        subject: 'JavaScript',
        completedAt: '2024-01-15T10:30:00Z',
        score: 75,
        totalQuestions: 20,
        correctAnswers: 15,
        timeSpent: 1800,
        skillBreakdown: [
            { skill: 'Data Types', questions: 4, correct: 3, percentage: 75 },
            {
                skill: 'Array Methods',
                questions: 3,
                correct: 1,
                percentage: 33,
            },
            { skill: 'Closures', questions: 2, correct: 2, percentage: 100 },
            { skill: 'Variables', questions: 3, correct: 3, percentage: 100 },
            { skill: 'Operators', questions: 2, correct: 0, percentage: 0 },
        ],
    },
    {
        id: 'progress-002',
        quizTitle: 'React Hooks Mastery',
        subject: 'React',
        completedAt: '2024-01-14T15:45:00Z',
        score: 85,
        totalQuestions: 15,
        correctAnswers: 13,
        timeSpent: 1200,
        skillBreakdown: [
            { skill: 'useState', questions: 5, correct: 5, percentage: 100 },
            { skill: 'useEffect', questions: 4, correct: 3, percentage: 75 },
            { skill: 'useContext', questions: 3, correct: 2, percentage: 67 },
            {
                skill: 'Custom Hooks',
                questions: 3,
                correct: 3,
                percentage: 100,
            },
        ],
    },
    {
        id: 'progress-003',
        quizTitle: 'CSS Grid & Flexbox',
        subject: 'CSS',
        completedAt: '2024-01-13T09:20:00Z',
        score: 90,
        totalQuestions: 18,
        correctAnswers: 16,
        timeSpent: 900,
        skillBreakdown: [
            { skill: 'Flexbox', questions: 8, correct: 7, percentage: 88 },
            { skill: 'Grid', questions: 6, correct: 6, percentage: 100 },
            {
                skill: 'Responsive Design',
                questions: 4,
                correct: 3,
                percentage: 75,
            },
        ],
    },
];

export const mockStudySessions: StudySession[] = [
    {
        id: 'session-001',
        date: '2024-01-15',
        duration: 45,
        subject: 'JavaScript',
        topics: ['Closures', 'Promises', 'Async/Await'],
        questionsAnswered: 25,
        correctAnswers: 20,
    },
    {
        id: 'session-002',
        date: '2024-01-14',
        duration: 30,
        subject: 'React',
        topics: ['Hooks', 'State Management'],
        questionsAnswered: 20,
        correctAnswers: 18,
    },
    {
        id: 'session-003',
        date: '2024-01-13',
        duration: 60,
        subject: 'CSS',
        topics: ['Grid', 'Flexbox', 'Animations'],
        questionsAnswered: 35,
        correctAnswers: 32,
    },
    {
        id: 'session-004',
        date: '2024-01-12',
        duration: 40,
        subject: 'JavaScript',
        topics: ['ES6+', 'Modules', 'Classes'],
        questionsAnswered: 28,
        correctAnswers: 24,
    },
];
