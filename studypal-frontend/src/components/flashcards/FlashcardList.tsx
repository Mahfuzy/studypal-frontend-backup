import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { flashcardService } from '../../services/studyServices';
import { Flashcard } from '../../services/types';

const FlashcardList: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: flashcards, isLoading, error } = useQuery<Flashcard[]>({
    queryKey: ['flashcards'],
    queryFn: async () => {
      const response = await flashcardService.getFlashcards();
      return response.data;
    },
  });

  const handleNext = () => {
    if (flashcards && currentIndex < flashcards.length - 1) {
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

  if (isLoading) return <div>Loading flashcards...</div>;
  if (error) return <div>Error loading flashcards</div>;
  if (!flashcards?.length) return <div>No flashcards available</div>;

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Flashcards</h2>
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-md aspect-[4/3]">
          <div
            className={`w-full h-full transition-transform duration-500 transform-gpu cursor-pointer ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-6 [backface-visibility:hidden]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-sm text-gray-500">{currentCard.subject}</p>
                  <h3 className="text-xl font-semibold mt-2">{currentCard.question}</h3>
                </div>
              </div>
            </div>
            <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex flex-col h-full justify-between">
                <p className="text-lg">{currentCard.answer}</p>
                <p className="text-sm text-gray-500">Click to flip back</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full max-w-md mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="py-2">
            {currentIndex + 1} / {flashcards.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardList; 