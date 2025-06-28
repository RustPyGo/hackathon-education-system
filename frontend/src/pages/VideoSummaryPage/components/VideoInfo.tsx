import type { VideoData } from '../mockData';
import { Play, Eye, Calendar, Clock } from 'lucide-react';

interface VideoInfoProps {
    videoData: VideoData;
}

const VideoInfo = ({ videoData }: VideoInfoProps) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                    <img
                        src={videoData.thumbnail}
                        alt={videoData.title}
                        className="w-full lg:w-80 h-48 lg:h-48 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-gray-800 ml-1" />
                        </div>
                    </div>
                </div>

                {/* Video Details */}
                <div className="flex-1 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {videoData.title}
                        </h2>
                        <p className="text-gray-600 text-sm line-clamp-3">
                            {videoData.description}
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{videoData.views} lượt xem</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{videoData.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {new Date(
                                    videoData.publishedAt
                                ).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Kênh:</span>{' '}
                            {videoData.channel}
                        </p>
                    </div>

                    {/* Video ID */}
                    <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-400">
                            Video ID: {videoData.id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoInfo;
