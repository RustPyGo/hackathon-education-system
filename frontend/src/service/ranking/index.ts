// API functions for ranking

export interface GlobalRankingData {
    overall_rank: number;
    total_users: number;
    average_score: number;
    total_exams_taken: number;
    best_performance: {
        project_title: string;
        score: number;
        rank: number;
    } | null;
}

export interface ProjectRankingStats {
    project_id: string;
    project_title: string;
    total_participants: number;
    average_score: number;
    highest_score: number;
    current_user_rank?: number;
    current_user_score?: number;
}

export async function getGlobalRanking(): Promise<GlobalRankingData> {
    const res = await fetch('/api/rankings/global');
    if (!res.ok) throw new Error('Failed to fetch global ranking');
    return res.json();
}

export async function getProjectsRanking(): Promise<ProjectRankingStats[]> {
    const res = await fetch('/api/rankings/projects');
    if (!res.ok) throw new Error('Failed to fetch projects ranking');
    return res.json();
}

// MOCK DATA for global/project stats
export const MOCK_GLOBAL_RANKING = {
    overall_rank: 3,
    total_users: 42,
    average_score: 78.5,
    total_exams_taken: 120,
    best_performance: {
        project_title: 'Biology IGCSE',
        score: 98,
        rank: 1,
    },
};

export const MOCK_PROJECTS_STATS = [
    {
        project_id: '1',
        project_title: 'Biology IGCSE',
        total_participants: 20,
        average_score: 85.2,
        highest_score: 98,
        current_user_rank: 2,
        current_user_score: 95,
    },
    {
        project_id: '2',
        project_title: 'Physics A-Level',
        total_participants: 15,
        average_score: 77.8,
        highest_score: 92,
        current_user_rank: 5,
        current_user_score: 80,
    },
];

// MOCK DATA for project ranking (per user, per project)
export const MOCK_PROJECT_RANKINGS = [
    {
        user_id: '1',
        user_name: 'Nguyen Van A',
        user_avatar: '',
        rank: 1,
        score: 95,
        total_questions: 10,
        time_spent: 320,
        percentile: 99,
        is_current_user: false,
    },
    {
        user_id: '2',
        user_name: 'Tran Thi B',
        user_avatar: '',
        rank: 2,
        score: 90,
        total_questions: 10,
        time_spent: 350,
        percentile: 90,
        is_current_user: true,
    },
    {
        user_id: '3',
        user_name: 'Le Van C',
        user_avatar: '',
        rank: 3,
        score: 85,
        total_questions: 10,
        time_spent: 400,
        percentile: 80,
        is_current_user: false,
    },
];
