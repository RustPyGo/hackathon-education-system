import ChatBox from './components/ChatBox';
import VideoInput from './components/VideoInput';
import VideoSummary from './components/VideoSummary';
import { useVideoSummary } from './hooks';

const VideoSummaryPage = () => {
    const {
        videoUrl,
        videoData,
        summary,
        isLoading,
        isSummarizing,
        handleSubmitUrl,
        chatMessages,
        sendMessage,
        isChatLoading,
    } = useVideoSummary();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-primary-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Video Summary AI
                    </h1>
                    <p className="text-xl text-gray-600">
                        Tóm tắt và hỏi AI về nội dung video YouTube
                    </p>
                </div>

                {/* Video Input */}
                <div className="mb-8">
                    <VideoInput
                        videoUrl={videoUrl}
                        onSubmit={handleSubmitUrl}
                        isLoading={isLoading}
                    />
                </div>

                {/* Main Content */}
                {videoData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Video Info & Summary */}
                        <div className="space-y-6">
                            {/* <VideoInfo videoData={videoData} /> */}
                            <VideoSummary
                                summary={summary}
                                isLoading={isSummarizing}
                            />
                        </div>

                        {/* Right Column - Chat Box */}
                        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-200px)]">
                            <ChatBox
                                messages={chatMessages}
                                onSendMessage={sendMessage}
                                isLoading={isChatLoading}
                                videoTitle={videoData.title}
                            />
                        </div>
                    </div>
                )}

                {/* Demo Content */}
                {!videoData && (
                    <div className="text-center py-12">
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Bắt đầu với video YouTube
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Dán đường link video YouTube vào ô bên trên
                                    để:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary-500 font-semibold">
                                                1
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Lấy Transcript
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Tự động trích xuất nội dung
                                                video
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary-500 font-semibold">
                                                2
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Tóm Tắt AI
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Tạo tóm tắt thông minh
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary-500 font-semibold">
                                                3
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Hỏi Đáp
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Chat với AI về nội dung
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoSummaryPage;
