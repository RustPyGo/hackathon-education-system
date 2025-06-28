import ChatInterface from '@/components/chat-interface';

export default async function Page() {
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return (
        <div>
            <ChatInterface projectId="12345" />
        </div>
    );
}
