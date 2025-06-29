import type { FlashCardDeck } from '../mockData';
import { useState, useCallback } from 'react';

interface UseFlashCardProps {
    deck: FlashCardDeck;
}

export const useFlashCard = ({ deck }: UseFlashCardProps) => {
    const [currentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = deck.cards[currentCardIndex];

    const handleCardFlip = useCallback(() => {
        console.log('Flip triggered, current state:', isFlipped);
        setIsFlipped((prev) => {
            console.log('Setting flipped to:', !prev);
            return !prev;
        });
    }, [isFlipped]);

    return {
        currentCard,
        isFlipped,
        handleCardFlip,
    };
};
