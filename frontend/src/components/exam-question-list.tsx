'use client';

import { Question, QuestionChoice } from '@/service/question';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const difficultyConfigs = {
    hard: {
        color: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    medium: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    easy: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
};

const questionStatusConfigs = {
    current: {
        color: 'bg-blue-500 text-white border-blue-500',
    },
    answered: {
        color: 'bg-green-500 text-white border-green-500',
    },
    unanswered: {
        color: 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-white',
    },
};

interface Props {
    questions: Question[];
}

export const ExamQuestionList = ({ questions }: Props) => {
    const [selectedChoices, setSelectedChoices] = useState<
        Record<string, QuestionChoice>
    >({});
    const answeredCount = useMemo(
        () => Object.keys(selectedChoices).length,
        [selectedChoices],
    );

    const [curIndex, setCurIndex] = useState(0);
    const curId = useMemo(() => questions[curIndex].id, [questions, curIndex]);

    const getQuestionStatus = (index: number) => {
        const question = questions[index];
        if (index === curIndex) return 'current';
        if (selectedChoices[question.id]) return 'answered';
        return 'unanswered';
    };

    const onSelect = (choiceId: string) => {
        const choice = questions[curIndex].choices.find(
            (c) => c.id === choiceId,
        )!;
        setSelectedChoices((prev) => ({
            ...prev,
            [curId]: choice,
        }));
    };

    return (
        <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-8">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge
                                    variant="outline"
                                    className={`capitalize bg-gray-50 text-gray-700 border-gray-200 ${difficultyConfigs[questions[curIndex].difficulty].color}`}
                                >
                                    {questions[curIndex].difficulty}
                                </Badge>
                            </div>
                            <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
                                {questions[curIndex].content}
                            </h2>
                        </div>

                        <RadioGroup
                            value={selectedChoices[curId]?.id}
                            onValueChange={onSelect}
                            className="space-y-3"
                        >
                            {questions[curIndex].choices.map(
                                (choice, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3"
                                    >
                                        <RadioGroupItem
                                            value={choice.id}
                                            id={choice.id}
                                            className="text-green-600"
                                        />
                                        <Label
                                            htmlFor={choice.id}
                                            className="flex-1 cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-900 font-medium"
                                        >
                                            <span className="inline-block w-6 text-gray-500 font-normal mr-2">
                                                {String.fromCharCode(
                                                    65 + index,
                                                )}
                                                .
                                            </span>
                                            {choice.content}
                                        </Label>
                                    </div>
                                ),
                            )}
                        </RadioGroup>
                    </CardContent>
                </Card>
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurIndex((prev) => prev - 1)}
                        disabled={curIndex === 0}
                        className="bg-white hover:bg-gray-50"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <div className="text-sm text-gray-500">
                        {curIndex + 1} of {questions.length} questions
                    </div>

                    {curIndex !== questions.length - 1 ? (
                        <Button
                            onClick={() => setCurIndex((prev) => prev + 1)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Next Question
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                            Finish Quiz
                            <CheckCircle className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
            <div className="lg:col-span-1">
                <Card className="border border-gray-200 shadow-sm sticky">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                            Quiz Summary
                        </h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">
                                    Progress
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                    {Math.round(
                                        (answeredCount / questions.length) *
                                            100,
                                    )}
                                    %
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-600">
                                        Answered
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {answeredCount}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600">
                                        Remaining
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {questions.length - answeredCount}
                                    </div>
                                </div>
                            </div>
                        </div>
                        Question Grid
                        <div className="space-y-3">
                            <div className="text-sm font-medium text-gray-700">
                                Questions
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {questions.slice(0, 20).map((_, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            onClick={() => setCurIndex(index)}
                                            className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${questionStatusConfigs[getQuestionStatus(index)].color}`}
                                        >
                                            {index + 1}
                                        </Button>
                                    );
                                })}
                                {questions.length > 20 && (
                                    <div className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-xs text-gray-500">
                                        +{questions.length - 20}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">
                                        Answered
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">
                                        Current
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                Standard exam mode
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
