// Built-in API key for StudyPal
const API_KEY = 'AIzaSyCiDKP20F6tPul5DbFKRZFqAqlmdczVci8';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const sendMessageToGemini = async (message: string, history: Message[] = []): Promise<string> => {
  try {
    const prompt = `You are Tae, a friendly AI study assistant. Your responses should be:
    - Written in plain text without any markdown formatting
    - Use simple bullet points with dashes (-) instead of asterisks
    - Use clear spacing between sections
    - Avoid using special characters or mathematical symbols in text
    - Write mathematical expressions in a simple, readable format
    - Keep paragraphs short and well-spaced
    - Use simple language that's easy to understand
    - Use emojis to make the response more engaging and friendly  
    - Use simple language that's easy to understand
    - Use short sentences and simple language
    
    Previous conversation:
    ${history.map(msg => `${msg.role}: ${msg.parts[0].text}`).join('\n')}
    
    Current question: ${message}
    
    Provide a helpful response that directly addresses the user's question.`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response generated from the AI');
    }
    
    return generatedText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while getting the AI response');
  }
};
