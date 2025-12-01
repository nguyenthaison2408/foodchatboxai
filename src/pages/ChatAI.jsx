import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Loader2, Send, Bot, User, Zap, Leaf, Utensils, 
  FileText, Mic, Trash2, StopCircle 
  // Đã xóa MicOff và AlertCircle vì không dùng đến để tránh lỗi ESLint
} from 'lucide-react';
import "../styles/ChatAI.scss";

const API_BASE_URL = "http://localhost:5000/api/chatai";

const ChatMessage = ({ role, text }) => {
  const isUser = role === "user";
  return (
    <div className={`chat-message ${isUser ? "user" : "ai"}`}>
      {!isUser && (
        <div className="icon-wrapper ai-bg">
          <Bot size={20} className="icon-white" />
        </div>
      )}
      <div className="bubble">
        {isUser ? (
          text
        ) : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({node, ...props}) => <div className="table-container"><table {...props} /></div>
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="icon-wrapper user-bg">
          <User size={20} className="icon-white" />
        </div>
      )}
    </div>
  );
};

export default function ChatAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Trạng thái Voice
  const [isListening, setIsListening] = useState(false);
  const [micStatus, setMicStatus] = useState("");
  const [micError, setMicError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const textBeforeListening = useRef(""); // Lưu văn bản cũ

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- LOGIC GIỌNG NÓI ĐÃ SỬA LỖI ESLINT ---
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    // Kiểm tra hỗ trợ
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ. Vui lòng dùng Google Chrome.");
      return;
    }

    setMicError(null);
    textBeforeListening.current = input; // Lưu văn bản đang có

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = true; 
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setMicStatus("Đang nghe...");
    };

    recognition.onresult = (event) => {
      let currentSessionTranscript = '';

      // SỬA LỖI ESLINT: Chỉ lấy final transcript, bỏ qua interimTranscript thừa
      for (let i = event.resultIndex; i < event.results.length; i++) {
        // Chúng ta lấy luôn transcript bất kể là final hay interim để hiển thị real-time
        // Logic cũ tách biến gây ra lỗi unused variable
        currentSessionTranscript += event.results[i][0].transcript;
      }

      // Cập nhật input: Văn bản cũ + Văn bản mới nói
      const spacer = (textBeforeListening.current && !textBeforeListening.current.endsWith(' ')) ? ' ' : '';
      setInput(textBeforeListening.current + spacer + currentSessionTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setMicError("Bị chặn quyền Mic! Hãy kiểm tra cài đặt trình duyệt.");
      }
    };

    recognition.onend = () => {
      // Tự động tắt trạng thái khi dừng hẳn
      setIsListening(false);
      setMicStatus("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setMicStatus("");
    }
  };

  // --- Logic Chat ---
  const clearHistory = () => {
    if(window.confirm("Xóa toàn bộ lịch sử trò chuyện?")) {
      setMessages([]);
    }
  };

  const handleSend = async (overrideText) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;

    if (isListening) stopListening();

    const newMessages = [...messages, { role: "user", text: textToSend }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(API_BASE_URL, { 
        message: textToSend,
        history: messages 
      });
      
      const reply = res.data.output || "⚠️ Không có phản hồi.";
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "⚠️ Lỗi kết nối server." }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { icon: <Zap size={16}/>, label: "Calo 1 bát phở?", prompt: "1 bát phở bò tái chín khoảng bao nhiêu calo?" },
    { icon: <Leaf size={16}/>, label: "Eat Clean menu", prompt: "Gợi ý thực đơn Eat Clean cho bữa trưa dưới 500 calo." },
    { icon: <Utensils size={16}/>, label: "Biến tấu trứng", prompt: "Tôi có trứng và cà chua, làm món gì ngon ngoài canh trứng?" },
    { icon: <FileText size={16}/>, label: "Vitamin C", prompt: "Top 5 loại trái cây nhiều Vitamin C nhất là gì?" }
  ];

  return (
    <div className="chat-page">
      <div className="chat-box">
        
        {/* HEADER */}
        <header className="chat-header">
          <div className="header-left">
            <div className="bot-avatar">
              <Bot size={24} color="#fff" />
            </div>
            <div>
              <h2>FoodAI Assistant</h2>
              <p>Trợ lý dinh dưỡng cá nhân</p>
            </div>
          </div>
          <button onClick={clearHistory} className="clear-btn" title="Xóa lịch sử">
            <Trash2 size={18} />
          </button>
        </header>

        {/* CHAT AREA */}
        <div className="chat-area">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Utensils size={40} /></div>
              <h3>Xin chào!</h3>
              <p>Bạn muốn hỏi gì về ẩm thực hôm nay?</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} text={msg.text} />
              ))}
              {isLoading && (
                <div className="loading-bubble">
                  <Loader2 className="spin" size={16} /> FoodAI đang soạn tin...
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT AREA */}
        <div className="input-section">
          <div className="chips-container">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSend(s.prompt)} className="chip" disabled={isLoading}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div className={`input-wrapper ${isListening ? 'listening-mode' : ''} ${micError ? 'error-mode' : ''}`}>
            {/* Nút Mic kiêm chỉ báo trạng thái */}
            <button 
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title={isListening ? "Bấm để dừng" : "Nhập bằng giọng nói"}
            >
              {isListening ? <StopCircle size={24} color="#dc2626" /> : <Mic size={20} />}
            </button>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={micStatus || (micError ? "Lỗi Mic (Xem bên dưới)" : "Nhập câu hỏi của bạn...")}
              rows={1}
              disabled={isLoading}
            />

            <button 
              className="send-btn"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
          
          <div className="disclaimer">
            {micError ? (
              <span className="text-red-500 font-bold flex items-center justify-center gap-1">
                {micError} 
              </span>
            ) : (
              isListening ? 
                <span className="text-red-600 font-bold animate-pulse">● Đang ghi âm... Bấm nút Mic lần nữa để dừng.</span> 
                : "FoodAI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng."
            )}
          </div>

        </div>
      </div>
    </div>
  );
}