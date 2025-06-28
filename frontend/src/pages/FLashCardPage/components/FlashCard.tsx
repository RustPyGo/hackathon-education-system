import type { FlashCard } from '../mockData';
import { RotateCcw, Sparkles, BookOpen, Target } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';
import './FlashCard.css';

interface FlashCardProps {
    card: FlashCard;
    isFlipped: boolean;
    onFlip: () => void;
}

const FlashCardComponent = ({ card, isFlipped, onFlip }: FlashCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Memoize the flip handler to prevent re-renders
    const handleFlip = useCallback(() => {
        onFlip();
    }, [onFlip]);

    // Add keyboard event listener for Space key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Space key (both code and key)
            if (event.code === 'Space' || event.key === ' ') {
                event.preventDefault(); // Prevent page scroll
                handleFlip();
            }
        };

        // Add event listener to document
        document.addEventListener('keydown', handleKeyDown, true);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [handleFlip]);

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4"
            ref={cardRef}
            tabIndex={0}
        >
            <div className="perspective-1000">
                <div
                    className={`card-container relative w-80 h-[426px] transition-transform duration-700 transform-style-preserve-3d ${
                        isFlipped ? 'rotate-y-180' : ''
                    }`}
                >
                    {/* Front of Card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                        <div
                            className="card-hover w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl border-0 p-8 flex flex-col justify-center items-center text-center shadow-2xl cursor-pointer relative overflow-hidden"
                            onClick={handleFlip}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full"></div>
                                <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 w-full">
                                {/* Icon */}
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <BookOpen className="w-10 h-10 text-white" />
                                </div>

                                {/* Question */}
                                <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                                    {card.front}
                                </h3>

                                {/* Action Hint */}
                                <div className="flex items-center justify-center space-x-3 text-white/80">
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                                        <RotateCcw className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Tap to flip
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            or Space
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                        <div
                            className="card-hover w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl border-0 p-8 flex flex-col justify-center items-center text-center shadow-2xl cursor-pointer relative overflow-hidden"
                            onClick={handleFlip}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full"></div>
                                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 w-full">
                                {/* Icon */}
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Target className="w-10 h-10 text-white" />
                                </div>

                                {/* Answer Label */}
                                <h4 className="text-xl font-bold text-white mb-6">
                                    Answer
                                </h4>

                                {/* Answer Content */}
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/30">
                                    <p className="text-white leading-relaxed text-lg">
                                        {card.back}
                                    </p>
                                </div>

                                {/* Action Hint */}
                                <div className="flex items-center justify-center space-x-3 text-white/80">
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                                        <RotateCcw className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Tap to flip back
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            or Space
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashCardComponent;
