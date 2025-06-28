import { FlashCard } from './components';
import { useFlashCard } from './hooks/useFlashCard';
import { mockFlashCardDeck } from './mockData';

const FlashCardPage = () => {
    const { currentCard, isFlipped, handleCardFlip } = useFlashCard({
        deck: mockFlashCardDeck,
    });

    if (!currentCard) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        No cards available
                    </h1>
                    <p className="text-gray-600">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <FlashCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleCardFlip}
        />
    );
};

export default FlashCardPage;
