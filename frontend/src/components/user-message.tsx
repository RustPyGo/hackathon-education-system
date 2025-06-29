import { ChatMessage } from '@/service/chat';
import { User } from 'lucide-react';

export default function UserMessage({ message }: { message: ChatMessage }) {
    return (
        <div className="flex gap-3 justify-end">
            <div className="max-w-[80%] p-3 rounded-lg bg-blue-600 text-white">
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                </p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-gray-600" />
            </div>
        </div>
    );
}
