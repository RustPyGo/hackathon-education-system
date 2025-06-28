import type { StudyRecommendation } from '../mockData';
import { BookOpen, Clock, ExternalLink } from 'lucide-react';

interface StudyRecommendationsProps {
    recommendations: StudyRecommendation[];
    getTypeIcon: (type: string) => string;
}

const StudyRecommendations = ({
    recommendations,
    getTypeIcon,
}: StudyRecommendationsProps) => {
    const sortedRecommendations = [...recommendations].sort((a, b) => {
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Study Recommendations
                    </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    Personalized resources to improve your weak areas
                </p>
            </div>

            <div className="p-6">
                {/* Vertical Layout for Recommendations */}
                <div className="space-y-4 mb-6">
                    {sortedRecommendations.map((recommendation) => (
                        <div
                            key={recommendation.id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl flex-shrink-0">
                                        {getTypeIcon(recommendation.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                                            {recommendation.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {recommendation.description}
                                        </p>
                                    </div>
                                </div>
                                {recommendation.url && (
                                    <a
                                        href={recommendation.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm flex-shrink-0"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Open</span>
                                    </a>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {/* Difficulty */}
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            recommendation.difficulty ===
                                            'beginner'
                                                ? 'bg-green-100 text-green-800'
                                                : recommendation.difficulty ===
                                                  'intermediate'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {recommendation.difficulty}
                                    </span>

                                    {/* Type */}
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        {recommendation.type}
                                    </span>
                                </div>

                                {/* Time */}
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{recommendation.estimatedTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Study Tips Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        💡 Study Tips
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>
                                Start with beginner resources if you're
                                struggling with a concept
                            </span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>
                                Practice regularly with the recommended
                                exercises
                            </span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Focus on your weakest skills first</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Take breaks between study sessions</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudyRecommendations;
