import { useState } from "react";
import axios from "axios";

export default function ChatAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      // Gọi backend Node.js để chat AI
      const res = await axios.post("/api/chat", { message: input });
      setMessages(prev => [...prev, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "ai", text: "Error from AI server." }]);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Chat with Food AI</h1>
      <div className="border p-4 h-96 overflow-y-auto mb-4 bg-white rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right mb-2" : "text-left mb-2"}>
            <span className={`inline-block px-4 py-2 rounded ${msg.role === "user" ? "bg-red-500 text-white" : "bg-gray-200 text-black"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask AI about food, recipes, nutrition..."
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleSend} className="bg-red-500 text-white px-4 rounded">Send</button>
      </div>
    </div>
  );
}
