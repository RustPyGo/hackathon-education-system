import {
    Brain,
    Target,
    BookOpen,
    BarChart3,
    Clock,
    Sparkles,
    ArrowRight,
    Play,
    Users,
    Award,
    Zap,
    CheckCircle,
} from 'lucide-react';

const HomePage = () => {
    const features = [
        {
            icon: Brain,
            title: 'AI Phân Tích Khả Năng',
            description:
                'Hệ thống AI thông minh phân tích năng lực học tập và tạo đề thi cá nhân hóa phù hợp với từng người học.',
            color: 'from-blue-500 to-purple-600',
        },
        {
            icon: Target,
            title: 'Đề Thi Cá Nhân Hóa',
            description:
                'Mỗi đề thi được tạo riêng biệt dựa trên trình độ, mục tiêu và điểm mạnh/yếu của người học.',
            color: 'from-green-500 to-teal-600',
        },
        {
            icon: BookOpen,
            title: 'Nguồn Kiến Thức Đa Dạng',
            description:
                'Tích hợp SGK, Wikipedia, tài liệu chuyên ngành để tạo đề thi chất lượng và cập nhật.',
            color: 'from-orange-500 to-red-600',
        },
        {
            icon: BarChart3,
            title: 'Theo Dõi Tiến Độ',
            description:
                'Phân tích chi tiết kết quả học tập, điểm mạnh/yếu và gợi ý cải thiện cá nhân hóa.',
            color: 'from-purple-500 to-pink-600',
        },
    ];

    const benefits = [
        {
            icon: Zap,
            title: 'Tiết Kiệm Thời Gian',
            description:
                'Không cần tìm kiếm đề thi lẻ tẻ trên mạng, mọi thứ được tạo tự động.',
        },
        {
            icon: Users,
            title: 'Không Cần Giáo Viên',
            description:
                'Học sinh có thể tự ôn tập hiệu quả mà không cần sự hỗ trợ trực tiếp.',
        },
        {
            icon: Award,
            title: 'Chất Lượng Cao',
            description:
                "Đề thi được tạo theo Bloom's Taxonomy với độ khó phù hợp.",
        },
        {
            icon: CheckCircle,
            title: 'Feedback Tức Thì',
            description:
                'Nhận kết quả và giải thích ngay lập tức sau khi hoàn thành bài thi.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-700">
                                    AI-Powered Learning
                                </span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AutoQuiz AI
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Nền tảng AI tạo đề thi cá nhân hóa thông minh, giúp
                            bạn học tập hiệu quả và đạt kết quả tốt nhất
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
                            <button className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <Play className="w-5 h-5" />
                                <span>Bắt Đầu Ngay</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button className="flex items-center space-x-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                <Play className="w-5 h-5" />
                                <span>Xem Demo</span>
                            </button>
                        </div>

                        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>10,000+ người dùng</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4" />
                                <span>98% hài lòng</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Tiết kiệm 70% thời gian</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tính Năng Nổi Bật
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Khám phá những tính năng độc đáo giúp AutoQuiz AI
                            trở thành lựa chọn hàng đầu cho việc học tập
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tại Sao Chọn AutoQuiz AI?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Những lợi ích vượt trội giúp bạn học tập hiệu quả
                            hơn bao giờ hết
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-4"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <benefit.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Sẵn Sàng Bắt Đầu Học Tập Thông Minh?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Tham gia cùng hàng nghìn người dùng đã cải thiện kết quả
                        học tập với AutoQuiz AI
                    </p>
                    <button className="flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mx-auto">
                        <Sparkles className="w-5 h-5" />
                        <span>Dùng Thử Miễn Phí</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
