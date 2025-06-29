// This file is deprecated. Use '@/service/ranking' instead.
export * from './ranking/index';

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
