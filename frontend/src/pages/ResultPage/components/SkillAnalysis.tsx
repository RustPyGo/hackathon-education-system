import type { SkillAnalysis } from '../mockData';
import { BarChart3, Filter } from 'lucide-react';

interface SkillAnalysisProps {
    skills: SkillAnalysis[];
    selectedSkill: string | null;
    onSkillSelect: (skill: string | null) => void;
    getStrengthColor: (strength: string) => string;
}

const SkillAnalysisComponent = ({
    skills,
    selectedSkill,
    onSkillSelect,
    getStrengthColor,
}: SkillAnalysisProps) => {
    const sortedSkills = [...skills].sort(
        (a, b) => b.percentage - a.percentage
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Skill Analysis
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                            Filter by skill
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {sortedSkills.map((skill) => (
                        <div
                            key={skill.skill}
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                selectedSkill === skill.skill
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() =>
                                onSkillSelect(
                                    selectedSkill === skill.skill
                                        ? null
                                        : skill.skill
                                )
                            }
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <h3 className="font-medium text-gray-900">
                                        {skill.skill}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStrengthColor(
                                            skill.strength
                                        )}`}
                                    >
                                        {skill.strength}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {skill.percentage}%
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {skill.correctAnswers}/
                                        {skill.totalQuestions}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        skill.percentage >= 80
                                            ? 'bg-green-500'
                                            : skill.percentage >= 60
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                    }`}
                                    style={{ width: `${skill.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {selectedSkill && (
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                        <p className="text-sm text-primary-700">
                            Showing questions for:{' '}
                            <span className="font-medium">{selectedSkill}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillAnalysisComponent;
