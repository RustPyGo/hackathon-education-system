import type { FlashCardDeck } from '../mockData';
import { useState } from 'react';

interface UseFlashCardProps {
    deck: FlashCardDeck;
}

export const useFlashCard = ({ deck }: UseFlashCardProps) => {
    const [currentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = deck.cards[currentCardIndex];

    const handleCardFlip = () => {
        console.log(isFlipped);
        setIsFlipped(!isFlipped);
    };

    return {
        currentCard,
        isFlipped,
        handleCardFlip,
    };
};
