'use client';

import React, { PropsWithChildren, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/service/question';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Mode = 'practice' | 'exam';

const getOptionStyle = (
    showExplantion: boolean,
    isSelected: boolean,
    isCorrect: boolean,
) => {
    let optionClass =
        'flex-1 cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-900 font-medium';

    if (showExplantion) {
        if (isCorrect) {
            optionClass =
                'flex-1 cursor-pointer p-4 rounded-lg border border-green-500 bg-green-50 text-green-900 font-medium';
        } else if (isSelected && !isCorrect) {
            optionClass =
                'flex-1 cursor-pointer p-4 rounded-lg border border-red-500 bg-red-50 text-red-900 font-medium';
        } else {
            optionClass =
                'flex-1 cursor-not-allowed p-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 font-medium';
        }
    }

    return optionClass;
};

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
    className?: string;
    mode: Mode;
    question: Question;
    selected?: string;
    onSelect: (id: string, choiceId: string) => void;
    attempts: number;
}

export const QuestionCard = ({
    className,
    mode,
    question,
    selected,
    onSelect,
    attempts,
}: Props) => {
    const [showExplantion, setShowExplaination] = useState(false);

    return (
        <Card className={cn('border border-gray-200 shadow-sm', className)}>
            <CardContent className="p-8">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge
                            variant="outline"
                            className={`capitalize bg-gray-50 text-gray-700 border-gray-200 ${difficultyConfigs[question.difficulty].color}`}
                        >
                            {question.difficulty}
                        </Badge>
                        {mode === 'practice' && attempts > 1 && (
                            <Badge
                                variant="outline"
                                className="bg-orange-50 text-orange-700 border-orange-200"
                            >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Retry #{attempts}
                            </Badge>
                        )}
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
                        {question.content}
                    </h2>
                </div>

                <RadioGroup
                    value={selected}
                    onValueChange={(newChoiceId) => {
                        onSelect(question.id, newChoiceId);
                    }}
                    className="space-y-3"
                >
                    {question.choices.map((choice, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3"
                        >
                            <RadioGroupItem
                                value={choice.id}
                                id={choice.id}
                                className="text-green-600"
                                disabled={showExplantion}
                            />
                            <Label
                                htmlFor={choice.id}
                                className={getOptionStyle(
                                    showExplantion,
                                    selected !== undefined,
                                    selected === choice.id && choice.isCorrect,
                                )}
                            >
                                <span className="inline-block w-6 text-gray-500 font-normal mr-2">
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                {choice.content}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>

                {/* {showExplantion && ( */}
                {/*     <div */}
                {/*         className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`} */}
                {/*     > */}
                {/*         <div */}
                {/*             className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`} */}
                {/*         > */}
                {/*             {isCorrect ? '✓ Correct!' : '✗ Incorrect'} */}
                {/*         </div> */}
                {/*         {!isCorrect && mode === 'practice' && ( */}
                {/*             <div className="text-red-700 text-sm mt-1"> */}
                {/*                 This question will be added to the end for */}
                {/*                 another attempt. */}
                {/*             </div> */}
                {/*         )} */}
                {/*     </div> */}
                {/* )} */}
            </CardContent>
        </Card>
    );
};

export const QuestionList = ({ questions }: { questions: Question[] }) => {
    const [current, setCurrent] = useState(0);

    return (
        <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
                <QuestionCard
                    mode="practice"
                    question={questions[current]}
                    onSelect={() => {}}
                    attempts={1}
                />
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrent((prev) => prev - 1)}
                        disabled={current === 0}
                        className="bg-white hover:bg-gray-50"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <div className="text-sm text-gray-500">
                        {current + 1} of {questions.length} questions
                    </div>

                    {current !== questions.length - 1 ? (
                        <Button
                            onClick={() => setCurrent((prev) => prev + 1)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Next Question
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrent((prev) => prev + 1)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Finish Quiz
                            <CheckCircle className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
