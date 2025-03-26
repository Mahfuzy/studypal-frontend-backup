import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch questions from your API
    const mockQuestions = [
      {
        id: 1,
        question: "What is the primary purpose of User Experience (UX) design?",
        options: [
          "To make websites look beautiful",
          "To improve user satisfaction and usability",
          "To increase website loading speed",
          "To add more features to a product"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which of the following is a key principle of calculus?",
        options: [
          "Binary operations",
          "Rate of change",
          "Boolean logic",
          "Data structures"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "What is gamification in learning?",
        options: [
          "Playing video games while studying",
          "Creating educational video games",
          "Applying game design elements in non-game contexts",
          "Using games as breaks between study sessions"
        ],
        correctAnswer: 2
      }
    ];

    setQuestions(mockQuestions);
    setLoading(false);
  }, []);

  const handleAnswerClick = (answerIndex: number) => {
    if (answerSubmitted) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setAnswerSubmitted(true);

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      <div className="max-w-3xl mx-auto">
        {showScore ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Complete! 🎉</h2>
            <p className="text-xl mb-8">
              You scored {score} out of {questions.length}
            </p>
            <div className="space-x-4">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Question {currentQuestion + 1}/{questions.length}</h2>
                <p className="text-lg">Score: {score}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-semibold mb-6">
                {questions[currentQuestion].question}
              </h3>
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    className={`w-full p-4 text-left rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? answerSubmitted
                          ? index === questions[currentQuestion].correctAnswer
                            ? 'bg-green-100 border-2 border-green-500'
                            : 'bg-red-100 border-2 border-red-500'
                          : 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-white border-2 border-gray-200 hover:border-blue-500'
                    }`}
                    disabled={answerSubmitted}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`w-full py-3 rounded-lg transition-colors ${
                selectedAnswer === null
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </>
        )}
      </div>
    </div>
  );
} 