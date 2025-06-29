'use client';

import BotMessage from '@/components/bot-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import UserMessage from '@/components/user-message';
import { fetchMessages, sendMessageApi } from '@/service/chat/api';
import type { ChatMessage } from '@/service/chat/type';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { Bot, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
    const [user, setUser] = useState<{ id: string; name?: string } | null>(
        null
    );
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const projectId = '12345'; // You can get this from params if needed

    useEffect(() => {
        async function fetchUser() {
            const { user } = await withAuth({ ensureSignedIn: true });
            console.log('Fetched user:', user);
            setUser(user);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchMessagesHandler();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, user]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessagesHandler = async () => {
        if (!user) return;
        try {
            console.log('Using projectId:', projectId, 'userId:', user.id);
            const data = await fetchMessages(projectId, user.id);
            console.log('Fetched messages:', data); // Log dữ liệu trả về
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        const messageText = newMessage.trim();
        setNewMessage('');
        await sendMessageApi(projectId, user.id, messageText);
        await fetchMessagesHandler();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!user || isInitialLoading) {
        return (
            <Card className="h-[600px] flex flex-col">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                    <div className="p-4 space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="h-4 w-2/3 rounded" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    AI Learning Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm mt-10">
                                Chưa có tin nhắn nào.
                            </div>
                        ) : (
                            messages.map((message) =>
                                message.role === 'user' ? (
                                    <UserMessage
                                        key={message.id}
                                        message={message}
                                    />
                                ) : (
                                    <BotMessage
                                        key={message.id}
                                        message={message}
                                    />
                                )
                            )
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                    <div className="flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question about the content..."
                            disabled={false}
                            className="flex-1"
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
