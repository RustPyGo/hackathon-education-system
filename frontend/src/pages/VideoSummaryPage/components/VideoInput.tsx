import Button from '@/components/Button';
import { Play, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface VideoInputProps {
    videoUrl: string;
    onSubmit: (url: string) => void;
    isLoading: boolean;
}

const VideoInput = ({ videoUrl, onSubmit, isLoading }: VideoInputProps) => {
    const [inputValue, setInputValue] = useState(videoUrl);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(inputValue);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pastedText = e.clipboardData.getData('text');
        if (
            pastedText.includes('youtube.com') ||
            pastedText.includes('youtu.be')
        ) {
            setInputValue(pastedText);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="video-url"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Nhập URL Video YouTube
                    </label>
                    <div className="relative">
                        <input
                            id="video-url"
                            type="url"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPaste={handlePaste}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                            disabled={isLoading}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                            ) : (
                                <Play className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    mode="contained"
                    colorScheme="primary"
                    size="large"
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            <span>Phân Tích Video</span>
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-4 text-sm text-gray-500">
                <p>💡 Mẹo: Dán trực tiếp URL video YouTube vào ô trên</p>
            </div>
        </div>
    );
};

export default VideoInput;
