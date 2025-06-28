import type { VideoData, ChatMessage } from '../mockData';
import { mockVideoData, mockSummary, mockChatMessages } from '../mockData';
import { useState, useCallback } from 'react';

export const useVideoSummary = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [chatMessages, setChatMessages] =
        useState<ChatMessage[]>(mockChatMessages);
    const [isChatLoading, setIsChatLoading] = useState(false);

    const handleSubmitUrl = useCallback(async (url: string) => {
        if (!url.trim()) return;

        setIsLoading(true);
        try {
            // Simulate API call to fetch video data
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setVideoData(mockVideoData);

            // Simulate AI summarization
            setIsSummarizing(true);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            setSummary(mockSummary);
            setIsSummarizing(false);
        } catch (error) {
            console.error('Error fetching video:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: message,
            timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, userMessage]);
        setIsChatLoading(true);

        try {
            // Simulate AI response
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: generateAIResponse(),
                timestamp: new Date(),
            };

            setChatMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsChatLoading(false);
        }
    }, []);

    const generateAIResponse = (): string => {
        const responses = [
            'Dựa trên nội dung video, tôi có thể giải thích rằng...',
            'Theo như video đã đề cập, vấn đề này liên quan đến...',
            'Trong video, chúng ta đã học về...',
            'Đây là một khái niệm quan trọng được nhắc đến trong video...',
            'Video đã cung cấp một ví dụ cụ thể về...',
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    };

    return {
        videoUrl,
        setVideoUrl,
        videoData,
        summary,
        isLoading,
        isSummarizing,
        handleSubmitUrl,
        chatMessages,
        sendMessage,
        isChatLoading,
    };
};
