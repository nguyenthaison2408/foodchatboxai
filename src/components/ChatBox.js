import React, { useState, useRef } from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import "./ChatBox.scss";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  // Xử lý gửi tin nhắn hoặc ảnh
  const sendMessage = async (text = "") => {
    if (!text && !selectedImage) return alert("Nhập tin nhắn hoặc chọn ảnh");

    setLoading(true);

    // Hiển thị tin nhắn user
    const newMessages = [...messages];
    if (text) newMessages.push({ sender: "user", text });
    if (selectedImage) newMessages.push({ sender: "user", image: URL.createObjectURL(selectedImage) });
    setMessages(newMessages);

    try {
      let res;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        res = await axios.post("http://localhost:5000/image-analysis", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("http://localhost:5000/chat", { message: text });
      }

      // Thêm reply AI
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: res.data.reply }
      ]);

      // Reset input và ảnh
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("❌ Lỗi khi gọi AI:", err.response?.data || err.message);
      setMessages(prev => [...prev, { sender: "bot", text: "❌ Lỗi khi gọi AI!" }]);
    }

    setLoading(false);
  };

  // Chọn ảnh
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Xóa preview ảnh
  const removePreview = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="chatbox">
      <ChatHeader />
      <div className="messages">
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            sender={msg.sender}
            text={msg.text}
            image={msg.image}
          />
        ))}
        {loading && <div className="loading">Đang xử lý...</div>}
      </div>

      <div className="chat-input-wrapper">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => { if(e.key === "Enter") sendMessage(e.target.value) }}
          disabled={loading}
          className="chat-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={loading}
          className="chat-file-input"
        />
        <button onClick={() => sendMessage()} disabled={loading} className="chat-send-btn">
          Gửi
        </button>
      </div>

      {selectedImage && (
        <div className="preview">
          <button className="close-btn" onClick={removePreview}>×</button>
          <p>Preview ảnh:</p>
          <img src={URL.createObjectURL(selectedImage)} alt="preview" />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
