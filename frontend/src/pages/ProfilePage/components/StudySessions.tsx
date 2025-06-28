import type { StudySession } from '../mockData';
import {
    BookOpen,
    Filter,
    Calendar,
    Clock,
    Target,
    CheckCircle,
} from 'lucide-react';

interface StudySessionsProps {
    sessions: StudySession[];
    subjects: string[];
    selectedSubject: string | null;
    formatTime: (minutes: number) => string;
    onSubjectFilter: (subject: string | null) => void;
}

const StudySessions = ({
    sessions,
    subjects,
    selectedSubject,
    formatTime,
    onSubjectFilter,
}: StudySessionsProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Study Sessions
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                            Filter by subject
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Subject Filter */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onSubjectFilter(null)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedSubject === null
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All Subjects
                        </button>
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => onSubjectFilter(subject)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    selectedSubject === subject
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sessions List */}
                <div className="space-y-4">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        {session.subject}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{session.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {formatTime(session.duration)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Target className="w-4 h-4" />
                                            <span>
                                                {session.questionsAnswered}{' '}
                                                questions
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold text-green-600">
                                        {session.correctAnswers}/
                                        {session.questionsAnswered}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {Math.round(
                                            (session.correctAnswers /
                                                session.questionsAnswered) *
                                                100
                                        )}
                                        % accuracy
                                    </div>
                                </div>
                            </div>

                            {/* Topics Covered */}
                            <div className="border-t pt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Topics Covered
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {session.topics.map((topic) => (
                                        <span
                                            key={topic}
                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sessions.length === 0 && (
                    <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                            No study sessions available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudySessions;
