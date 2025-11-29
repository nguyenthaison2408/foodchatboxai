import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2, Send, Bot, User, Zap, Leaf, Utensils, FileText } from 'lucide-react';
import "../styles/ChatAI.scss";

const API_BASE_URL = "http://localhost:5000/api/chatai";

const ChatMessage = ({ role, text }) => {
  const isUser = role === "user";

  return (
    <div className={`chat-message ${isUser ? "user" : "ai"}`}>
      {!isUser && (
        <div className="icon-wrapper">
          <Bot className="icon ai-icon" />
        </div>
      )}

      <div className="bubble">
        {text}
      </div>

      {isUser && (
        <div className="icon-wrapper user-icon-wrapper">
          <User className="icon user-icon" />
        </div>
      )}
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

  const handleSend = async (overrideText) => {
    const messageToSend = overrideText || input;
    if (!messageToSend.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: "user", text: messageToSend }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(API_BASE_URL, { prompt: messageToSend });
      const reply = res.data.output?.trim() || "⚠️ Không nhận được phản hồi.";
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: "ai",
        text: "⚠️ Xin lỗi, FoodAI đang gặp sự cố kết nối."
      }]);
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
    { icon: <Zap />, label: "Calo phở bò?", prompt: "1 bát phở bò tái chín có bao nhiêu calo và protein?" },
    { icon: <Leaf />, label: "Công thức Healthy", prompt: "Tôi muốn làm bánh bông lan low calo và không đường. Hãy gợi ý thay đổi nguyên liệu." },
    { icon: <Utensils />, label: "Gợi ý món kèm", prompt: "Tôi đang ăn Bít tết, nên uống rượu gì và ăn kèm món phụ nào?" },
    { icon: <FileText />, label: "Dinh dưỡng quả bơ", prompt: "Tóm tắt giá trị dinh dưỡng và lợi ích của quả bơ." }
  ];

  return (
    <div className="chat-page">
      <div className="chat-box">

        {/* HEADER */}
        <header className="chat-header">
          <div className="header-info">
            <Bot className="header-icon" />
            <div>
              <h2>FoodAI Assistant</h2>
              <p>Chuyên gia Dinh dưỡng & Ẩm thực</p>
            </div>
          </div>
          <span className="model-tag">Gemini 2.5 Flash</span>
        </header>

        {/* CHAT AREA */}
        <div className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">
                <Utensils className="welcome-utensils" />
              </div>
              <h3>Xin chào!</h3>
              <p>Hãy hỏi về calo, thực đơn giảm cân hoặc biến tấu món ăn nhé!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} text={msg.text} />
              ))}
              {isLoading && (
                <div className="loading-msg">
                  <Loader2 className="spin" />
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT AREA */}
        <div className="input-area">

          {/* Suggestion Chips */}
          <div className="suggestion-row">
            {suggestions.map((s, index) => (
              <button
                key={index}
                onClick={() => handleSend(s.prompt)}
                className="suggestion-btn"
                disabled={isLoading}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="input-row">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập nội dung câu hỏi..."
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="spin" /> : <Send />}
            </button>
          </div>

          <div className="disclaimer">
            FoodAI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng.
          </div>

        </div>
      </div>
    </div>
  );
}
