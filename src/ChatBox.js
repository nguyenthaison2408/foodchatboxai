import { useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    const res = await axios.post("http://localhost:5000/chat", { message: input });
    setMessages([...messages, userMsg, res.data]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h2>🍲 Chatbot Tư vấn Đồ Ăn</h2>
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i} className={m.role}>{m.content}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Hỏi AI: Hôm nay ăn gì?"
      />
      <button onClick={sendMessage}>Gửi</button>
    </div>
  );
}
