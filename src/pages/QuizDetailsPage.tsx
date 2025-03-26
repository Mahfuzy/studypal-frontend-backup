import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, createQuizAttempt } from '../services/api';
import { authService } from '../services/auth';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_option: number;
}

interface Quiz {
  id: number;
  course_id: number;
  title: string;
  description: string;
  total_questions: number;
  time_limit: number;
  difficulty: string;
  status: string;
  questions: Question[];
}

export default function QuizDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!id) throw new Error('No quiz ID provided');
        const response = await getQuizById(parseInt(id));
        setQuiz(response.data);
        setSelectedAnswers(new Array(response.data.questions.length).fill(-1));
      } catch (err) {
        setError('Failed to fetch quiz');
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quizStarted && timeLeft !== null) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        handleQuizSubmit();
      }
    }
  }, [quizStarted, timeLeft]);

  const startQuiz = () => {
    if (quiz) {
      setQuizStarted(true);
      setTimeLeft(quiz.time_limit * 60);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!quizStarted || quizCompleted) return;

    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = optionIndex;
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_option) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleQuizSubmit = async () => {
    if (!quiz || !currentUser) return;

    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setQuizCompleted(true);

    try {
      await createQuizAttempt({
        user_id: currentUser.id,
        quiz_id: quiz.id,
        start_time: new Date(Date.now() - (quiz.time_limit * 60 * 1000)).toISOString(),
        end_time: new Date().toISOString(),
        score: calculatedScore,
        answers: selectedAnswers.map((selected, index) => ({
          question_id: quiz.questions[index].id,
          selected_option: selected,
          is_correct: selected === quiz.questions[index].correct_option
        }))
      });
    } catch (err) {
      console.error('Error saving quiz attempt:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-3xl p-8">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex-1 bg-white rounded-3xl p-8">
        <div className="text-red-500">{error || 'Quiz not found'}</div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="flex-1 bg-white rounded-3xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Quiz Completed!</h1>
          <div className="mb-8">
            <div className="text-6xl font-bold text-blue-500 mb-2">{score}%</div>
            <p className="text-gray-600">
              You answered {selectedAnswers.filter((ans, i) => ans === quiz.questions[i].correct_option).length} out of {quiz.questions.length} questions correctly.
            </p>
          </div>
          <button
            onClick={() => navigate(`/courses/${quiz.course_id}`)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
        </div>

        {!quizStarted ? (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Details</h2>
              <div className="space-y-2 text-gray-600">
                <p>Total Questions: {quiz.total_questions}</p>
                <p>Time Limit: {quiz.time_limit} minutes</p>
                <p>Difficulty: {quiz.difficulty}</p>
              </div>
            </div>
            <button
              onClick={startQuiz}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
              {timeLeft !== null && (
                <div className="text-gray-600">
                  Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {quiz.questions[currentQuestion].question}
              </h2>
              <div className="space-y-3">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-lg ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleQuizSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 