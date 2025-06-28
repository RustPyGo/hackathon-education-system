import { Brain, Loader2 } from 'lucide-react';

interface VideoSummaryProps {
    summary: string;
    isLoading: boolean;
}

const VideoSummary = ({ summary, isLoading }: VideoSummaryProps) => {
    if (isLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Tóm Tắt AI
                        </h3>
                        <p className="text-sm text-gray-500">
                            Đang phân tích và tóm tắt nội dung...
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>

                <div className="flex items-center justify-center mt-6">
                    <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                    <span className="ml-2 text-sm text-gray-600">
                        AI đang xử lý transcript...
                    </span>
                </div>
            </div>
        );
    }

    if (!summary) {
        return null;
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        Tóm Tắt AI
                    </h3>
                    <p className="text-sm text-gray-500">
                        Nội dung chính của video
                    </p>
                </div>
            </div>

            <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-primary-500">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {summary}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>✨ Được tạo bởi AI</span>
                <span>Dựa trên transcript video</span>
            </div>
        </div>
    );
};

export default VideoSummary;
