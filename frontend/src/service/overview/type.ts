export interface Overview3 {
    project_id: string;
    summary: string;
    updated_at: string;
}

export interface Project {
    id: string;
    title?: string;
    created_at: string;
    file_url?: string;
    overview?: string;
}
