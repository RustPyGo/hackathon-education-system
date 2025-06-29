'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Shuffle,
    BookOpen,
} from 'lucide-react';
import LoadingSpinner from '@/components/loading-spinner';
import { FlashCard } from '@/service/flashcard/type';
import { fetchFlashCardsMock } from '@/service/flashcard/api';

function ProjectFlashcardsPage() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId') || '';
    const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await fetchFlashCardsMock(projectId);
            setFlashCards(data);
            setLoading(false);
        }
        fetchData();
    }, [projectId]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsFlipped((prev) => !prev);
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                handlePrevious();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isFlipped, currentIndex]); // eslint-disable-next-line react-hooks/exhaustive-deps

    const handleNext = () => {
        if (currentIndex < flashCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleShuffle = () => {
        const shuffled = [...flashCards].sort(() => Math.random() - 0.5);
        setFlashCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const generateFlashCards = async () => {
        setIsGenerating(true);
        const newCards = await fetchFlashCardsMock(projectId);
        setFlashCards(newCards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsGenerating(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <LoadingSpinner size="lg" text="Loading flashcards..." />
            </div>
        );
    }

    if (flashCards.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No flashcards yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Generate AI-powered flashcards from your PDF content
                        </p>
                    </div>
                    <Button
                        onClick={generateFlashCards}
                        disabled={isGenerating}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isGenerating ? (
                            <LoadingSpinner size="sm" text="Generating..." />
                        ) : (
                            'Generate Flashcards'
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const currentCard = flashCards[currentIndex];
    const progress = ((currentIndex + 1) / flashCards.length) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Flashcards
                    </h2>
                    <p className="text-gray-600">
                        Use spacebar to flip, arrow keys to navigate
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleShuffle} size="sm">
                        <Shuffle className="h-4 w-4 mr-2" />
                        Shuffle
                    </Button>
                    <Button variant="outline" onClick={handleReset} size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>
                        Card {currentIndex + 1} of {flashCards.length}
                    </span>
                    <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Flashcard */}
            <div className="flex justify-center">
                <div className="relative w-full max-w-2xl">
                    <Card
                        className={`h-80 cursor-pointer transition-all duration-500 transform-gpu ${
                            isFlipped ? 'rotate-y-180' : ''
                        }`}
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Front */}
                        <CardContent
                            className="absolute inset-0 flex items-center justify-center p-8 backface-hidden"
                            style={{
                                backfaceVisibility: 'hidden',
                            }}
                        >
                            <div className="text-center">
                                <Badge className="mb-4 bg-blue-100 text-blue-800">
                                    Question
                                </Badge>
                                <p className="text-xl font-medium text-gray-900 leading-relaxed">
                                    {currentCard.question}
                                </p>
                                <p className="text-sm text-gray-500 mt-6">
                                    Click or press spacebar to reveal answer
                                </p>
                            </div>
                        </CardContent>

                        {/* Back */}
                        <CardContent
                            className="absolute inset-0 flex items-center justify-center p-8 backface-hidden rotate-y-180"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                            }}
                        >
                            <div className="text-center">
                                <Badge className="mb-4 bg-green-100 text-green-800">
                                    Answer
                                </Badge>
                                <p className="text-xl font-medium text-gray-900 leading-relaxed">
                                    {currentCard.answer}
                                </p>
                                <p className="text-sm text-gray-500 mt-6">
                                    Click or press spacebar to see question
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 bg-transparent"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                {/* <div className="flex gap-2">
                    {flashCards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                setIsFlipped(false);
                            }}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentIndex
                                    ? 'bg-blue-600'
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div> */}

                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentIndex === flashCards.length - 1}
                    className="flex items-center gap-2 bg-transparent"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Keyboard shortcuts */}
            <Card className="bg-gray-50">
                <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                        Keyboard Shortcuts
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                            <kbd className="px-2 py-1 bg-white rounded border text-xs">
                                Space
                            </kbd>
                            <span className="ml-2">Flip card</span>
                        </div>
                        <div>
                            <kbd className="px-2 py-1 bg-white rounded border text-xs">
                                ←
                            </kbd>
                            <span className="ml-2">Previous</span>
                        </div>
                        <div>
                            <kbd className="px-2 py-1 bg-white rounded border text-xs">
                                →
                            </kbd>
                            <span className="ml-2">Next</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ProjectFlashcardsPage;
