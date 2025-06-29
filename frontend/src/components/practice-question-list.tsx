'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Question, QuestionChoice } from '@/service/question';
import { CheckCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';

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

interface Props {
    questions: Question[];
}

export const PracticeQuestionList = ({ questions: raw }: Props) => {
    const [questions, setQuestions] = useState(raw);
    const [attempts, setAttempts] = useState<Record<string, number>>({});
    const [selectedChoice, setSelectedChoice] = useState<
        QuestionChoice | undefined
    >();

    const handleReset = () => {
        window.location.reload();
    };

    if (questions.length === 0) {
        return (
            <Card className="text-center">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Congratulations!
                        </h2>
                        <p className="text-gray-600">
                            You&apos;ve completed all the practice questions.
                        </p>
                        <Button onClick={handleReset}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Practice Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const curId = questions[0].id;

    const onSelect = (newChoiceId: string) => {
        const choice = questions[0].choices.find((c) => c.id === newChoiceId);
        console.log(choice);

        setSelectedChoice(choice);
    };

    const onNextQuestion = () => {
        if (selectedChoice?.is_correct) {
            setQuestions((prev) => prev.slice(1));
        } else {
            setAttempts((prev) => ({
                ...prev,
                [questions[0].id]: prev[questions[0].id] ?? 0 + 1,
            }));
            setQuestions((prev) => [...prev.slice(1), prev[0]]);
        }
        setSelectedChoice(undefined);
    };

    return (
        <div className="grid space-y-6">
            <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-8">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge
                                variant="outline"
                                className={`capitalize bg-gray-50 text-gray-700 border-gray-200 ${
                                    difficultyConfigs[questions[0].difficulty]
                                        .color
                                }`}
                            >
                                {questions[0].difficulty}
                            </Badge>
                            {attempts[curId] > 1 && (
                                <Badge
                                    variant="outline"
                                    className="bg-orange-50 text-orange-700 border-orange-200"
                                >
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    Retry #{attempts[curId]}
                                </Badge>
                            )}
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
                            {questions[0].content}
                        </h2>
                    </div>

                    <RadioGroup
                        value={selectedChoice?.id}
                        onValueChange={onSelect}
                        className="space-y-3"
                    >
                        {questions[0].choices.map((choice, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3"
                            >
                                <RadioGroupItem
                                    value={choice.id}
                                    id={choice.id}
                                    className="text-green-600"
                                    disabled={selectedChoice !== undefined}
                                />
                                <Label
                                    htmlFor={choice.id}
                                    className="flex-1 cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-900 font-medium"
                                >
                                    <span className="inline-block w-6 text-gray-500 font-normal mr-2">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    {choice.content}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    {selectedChoice && (
                        <div
                            className={`mt-4 p-4 rounded-lg ${
                                selectedChoice.is_correct
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                            }`}
                        >
                            <div
                                className={`font-medium ${
                                    selectedChoice.is_correct
                                        ? 'text-green-800'
                                        : 'text-red-800'
                                }`}
                            >
                                {}

                                {`${selectedChoice.is_correct ? '✓' : '✗'} ${
                                    selectedChoice.explanation
                                }`}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Button
                    onClick={onNextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Next Question
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};
