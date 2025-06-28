import type { ChatMessage } from '../mockData';
import Button from '@/components/Button';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatBoxProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    videoTitle: string;
}

const ChatBox = ({
    messages,
    onSendMessage,
    isLoading,
    videoTitle,
}: ChatBoxProps) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            Chat với AI
                        </h3>
                        <p className="text-xs text-gray-500 truncate max-w-48">
                            {videoTitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.type === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                        }`}
                    >
                        <div
                            className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                                message.type === 'user'
                                    ? 'flex-row-reverse space-x-reverse'
                                    : ''
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    message.type === 'user'
                                        ? 'bg-primary-500'
                                        : 'bg-gray-100'
                                }`}
                            >
                                {message.type === 'user' ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-gray-600" />
                                )}
                            </div>
                            <div
                                className={`px-4 py-2 rounded-2xl ${
                                    message.type === 'user'
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">
                                    {message.content}
                                </p>
                                <p
                                    className={`text-xs mt-1 ${
                                        message.type === 'user'
                                            ? 'text-primary-50'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="px-4 py-2 bg-gray-100 rounded-2xl">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                                    <span className="text-sm text-gray-500">
                                        AI đang trả lời...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Hỏi về nội dung video..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        mode="contained"
                        colorScheme="primary"
                        size="medium"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>

                <div className="mt-2 text-xs text-gray-500">
                    <p>
                        💡 Gợi ý: "Giải thích về supervised learning", "Tóm tắt
                        phần neural networks"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
