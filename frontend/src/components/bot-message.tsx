import { ChatMessage } from '@/service/chat';
import { Bot } from 'lucide-react';

export default function BotMessage({ message }: { message: ChatMessage }) {
    return (
        <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}
