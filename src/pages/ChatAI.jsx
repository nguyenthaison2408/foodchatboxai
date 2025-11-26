import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2, Send, Bot, User, Leaf, Zap, Utensils, FileText } from 'lucide-react';

const API_BASE_URL = "http://localhost:5000/api/chatai";

// Component hiển thị tin nhắn (Hỗ trợ xuống dòng tốt hơn)
const ChatMessage = ({ role, text }) => {
  const isUser = role === "user";
  const bgColor = isUser ? "bg-red-600 text-white" : "bg-white text-gray-800 border border-gray-200";
  const alignment = isUser ? "self-end" : "self-start";

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in-up`}>
      <div className={`max-w-[85%] sm:max-w-md p-4 rounded-2xl shadow-sm flex items-start gap-3 ${bgColor} ${alignment}`}>
        {!isUser && (
          <div className="flex-shrink-0 bg-red-100 p-2 rounded-full">
            <Bot className="w-5 h-5 text-red-600" />
          </div>
        )}
        <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
          {text}
        </div>
        {isUser && (
          <div className="flex-shrink-0 bg-red-700 p-2 rounded-full">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (messageOverride) => {
    const textToSend = messageOverride || input;
    if (!textToSend.trim() || isLoading) return;

    // UI Updates
    setMessages(prev => [...prev, { role: "user", text: textToSend }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(API_BASE_URL, { prompt: textToSend });
      setMessages(prev => [...prev, { role: "ai", text: res.data.output }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "ai", text: "⚠️ Xin lỗi, FoodAI đang gặp sự cố kết nối." }]);
    } finally {
      setIsLoading(false);
      // Focus lại vào input sau khi gửi xong (trải nghiệm tốt hơn trên PC)
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Các nút gợi ý nhanh (Suggestion Chips)
  const suggestions = [
    { icon: <Zap size={16}/>, label: "Calo trong 1 bát phở bò?", prompt: "1 bát phở bò tái chín có bao nhiêu calo và protein?" },
    { icon: <Leaf size={16}/>, label: "Sửa công thức Healthy", prompt: "Tôi muốn làm bánh bông lan nhưng ít calo và không đường kính. Hãy gợi ý thay đổi nguyên liệu." },
    { icon: <Utensils size={16}/>, label: "Gợi ý món kèm", prompt: "Tôi đang ăn Bít tết (Steak), nên uống rượu gì và ăn kèm món phụ nào?" },
    { icon: <FileText size={16}/>, label: "Tóm tắt dinh dưỡng", prompt: "Hãy tóm tắt giá trị dinh dưỡng và lợi ích của quả bơ (Avocado)." },
  ];

  return (
    <div className="bg-orange-50 min-h-screen p-4 sm:p-6 flex justify-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[85vh] border border-orange-100">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-4 shadow-md flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bot className="w-7 h-7" />
              FoodAI Assistant
            </h2>
            <p className="text-xs text-red-100 opacity-90 mt-1">Chuyên gia dinh dưỡng & Ẩm thực</p>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            Gemini 2.5 Flash
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
              <div className="bg-red-100 p-6 rounded-full mb-6 animate-pulse">
                <Utensils className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Xin chào!</h3>
              <p className="text-gray-500 max-w-md">
                Tôi là trợ lý ảo của bạn. Hãy hỏi tôi về tính toán calo, thực đơn giảm cân, hoặc cách biến tấu món ăn nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} text={msg.text} />
              ))}
              {isLoading && (
                <div className="flex justify-start animate-pulse">
                   <div className="bg-gray-200 text-gray-500 px-4 py-3 rounded-2xl rounded-tl-none text-sm flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Đang phân tích dữ liệu...
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Suggestion Chips & Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          
          {/* Suggestion Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s.prompt)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap border border-red-100"
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-50 border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 p-3 rounded-xl resize-none outline-none text-gray-700 transition-all min-h-[50px] max-h-[120px]"
              placeholder="Hỏi về dinh dưỡng, công thức..."
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              className={`h-[50px] w-[50px] flex items-center justify-center rounded-xl shadow-lg transition-all transform active:scale-95 ${
                isLoading || !input.trim() 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200'
              }`}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </button>
          </div>
          <div className="text-center text-[10px] text-gray-400">
            FoodAI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin y tế quan trọng.
          </div>
        </div>
      </div>
    </div>
  );
}