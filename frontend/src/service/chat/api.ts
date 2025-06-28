import type { ChatMessage } from './type';

// --- REAL API CODE (commented for reference) ---
// export async function fetchMessages(projectId: string): Promise<ChatMessage[]> {
//     const response = await fetch(`/api/projects/${projectId}/chat`);
//     if (!response.ok) throw new Error('Failed to fetch messages');
//     return response.json();
// }
//
// export async function sendMessageApi(
//     projectId: string,
//     message: string
// ): Promise<ChatMessage[]> {
//     const response = await fetch(`/api/projects/${projectId}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message }),
//     });
//     if (!response.ok) throw new Error('Failed to send message');
//     return response.json();
// }

const MOCK_MESSAGES: ChatMessage[] = [
    {
        id: '1',
        user_id: 'user1',
        project_id: '12345',
        role: 'user',
        content: 'Hello, what is this project about?',
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        user_id: 'user1',
        project_id: '12345',
        role: 'bot',
        content:
            'This is an AI-powered learning platform that helps you study from your PDF documents!',
        created_at: new Date().toISOString(),
    },
];

export async function fetchMessages(
    projectId: string,
    _userId: string
): Promise<ChatMessage[]> {
    // Mock: always return the same messages for the project
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_MESSAGES.filter((m) => m.project_id === projectId);
}

export async function sendMessageApi(
    projectId: string,
    userId: string,
    message: string
): Promise<ChatMessage[]> {
    // Mock: add the user message and a fake bot reply
    await new Promise((res) => setTimeout(res, 600));
    const userMsg: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        user_id: userId,
        project_id: projectId,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
    };
    const botMsg: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        user_id: userId,
        project_id: projectId,
        role: 'bot',
        content: `Bot reply to: "${message}"`,
        created_at: new Date().toISOString(),
    };
    return [
        ...MOCK_MESSAGES.filter(
            (m) => m.project_id === projectId && m.user_id === userId
        ),
        userMsg,
        botMsg,
    ];
}
