import React, { useState } from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import "./ChatBox.scss";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text, image) => {
    setLoading(true);

    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);

    try {
      let res;
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        res = await axios.post("http://localhost:5000/api/chat/image", formData);
      } else {
        res = await axios.post("http://localhost:5000/api/chat", { message: text });
      }

      setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { sender: "bot", text: "❌ Lỗi khi gọi AI!" }]);
    }

    setLoading(false);
  };

  return (
    <div className="chatbox">
      <ChatHeader />
      <div className="messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <div className="loading">Đang xử lý...</div>}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;
