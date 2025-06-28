'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChatMessage } from '@/service/chat/type';
import { fetchMessages, sendMessageApi } from '@/service/chat/api';

interface ChatInterfaceProps {
    projectId: string;
}

export default function ChatInterface({ projectId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessagesHandler();
    }, [projectId]);

    useEffect(() => {
        // Scroll to bottom when new messages are added
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessagesHandler = async () => {
        try {
            const data = await fetchMessages(projectId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageText = newMessage.trim();
        setNewMessage('');

        await sendMessageApi(projectId, messageText);
        await fetchMessagesHandler();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (isInitialLoading) {
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
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${
                                    message.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                {message.role === 'bot' && (
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-4 w-4 text-blue-600" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">
                                        {message.content}
                                    </p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {new Date(
                                            message.created_at
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                                {message.role === 'user' && (
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}
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
