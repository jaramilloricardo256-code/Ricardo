
import React, { useState, useRef, useEffect } from 'react';
import { getAITutorResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AITutor: React.FC<{ courseTitle?: string }> = ({ courseTitle }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `¡Hola! Soy tu tutor virtual de EducaPro. ¿En qué puedo ayudarte hoy con el curso ${courseTitle ? `"${courseTitle}"` : "que estás viendo"}?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const context = courseTitle ? `El estudiante está viendo el curso: ${courseTitle}` : undefined;
    const aiResponse = await getAITutorResponse(userMsg, context);

    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
        <i className="fas fa-robot text-xl"></i>
        <div>
          <h3 className="font-bold text-sm">Tutoría con IA</h3>
          <p className="text-xs text-blue-100">Disponible 24/7</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-sm text-gray-500 text-xs flex items-center gap-2">
              <i className="fas fa-circle-notch fa-spin"></i> Pensando...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu duda académica..."
            className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AITutor;
