import { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const TaeAIPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.style.height = `${window.innerHeight - 200}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e?: React.FormEvent, suggestedQuery?: string) => {
    e?.preventDefault();
    setError(null);
    
    const query = suggestedQuery || input;
    if (!query.trim()) return;

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: query }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(query, messages);
      const aiMessage: Message = {
        role: 'model',
        parts: [{ text: response }]
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      setError(error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again later.');
      const errorMessage: Message = {
        role: 'model',
        parts: [{ text: 'Sorry, I encountered an error. Please try again later.' }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    handleSubmit(undefined, query);
  };

  const suggestions = [
    "Help me create a study schedule for my upcoming exams",
    "Can you explain the concept of derivatives in calculus?",
    "What are some effective note-taking techniques?",
    "How can I improve my focus while studying?",
    "Can you help me break down this complex topic?"
  ];

  return (
    <div className="flex-1 bg-blue-50 rounded-3xl flex flex-col overflow-hidden h-[100vh]">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200">
        <div className="text-center">
          <div className="inline-block">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h1 className="text-gray-700 text-lg mt-2">Ask Tae anything</h1>
        </div>
      </div>

      {/* Main chat area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img 
                src="/tae-avatar.png" 
                alt="Tae AI Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {message.parts[0].text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="p-4">
          <p className="text-gray-500 text-center mb-4">Suggestions on what to ask Tae</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuery(suggestion)}
                className="bg-white text-gray-800 rounded-full px-4 py-2 text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your studies"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
            ref={inputRef}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-purple-100 text-purple-500 p-2 rounded-full disabled:opacity-50 hover:bg-purple-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaeAIPage; 