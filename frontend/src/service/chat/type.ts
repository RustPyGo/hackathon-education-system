export interface ChatMessage {
    id: string;
    project_id: string;
    role: 'user' | 'bot';
    content: string;
    created_at: string;
}
