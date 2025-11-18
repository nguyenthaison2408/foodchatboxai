import React, { useState, useRef } from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import "./ChatUI.scss";

// ====== CONFIG BACKEND ======
const API = "http://localhost:5000";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef();
  const textInputRef = useRef();

  // ---------------- SEND MESSAGE -----------------
  const sendMessage = async (text = "") => {
    if (!text && !selectedImage) return alert("Nhập tin nhắn hoặc chọn ảnh");

    setLoading(true);

    // Hiển thị tin nhắn user
    const newMsgs = [...messages];
    if (text) newMsgs.push({ sender: "user", text });
    if (selectedImage)
      newMsgs.push({ sender: "user", image: URL.createObjectURL(selectedImage) });
    setMessages(newMsgs);

    try {
      let res;

      // ---------- IMAGE MODE ----------
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        res = await axios.post(`${API}/image-analysis`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Nếu backend trả JSON danh sách món
        if (Array.isArray(res.data.reply)) {
          const foods = res.data.reply.map(item => ({
            sender: "bot",
            food: item
          }));
          setMessages(prev => [...prev, ...foods]);
        } else {
          setMessages(prev => [...prev, { sender: "bot", text: res.data.reply }]);
        }
      }

      // ---------- TEXT MODE ----------
      else {
        res = await axios.post(`${API}/chat`, { message: text });

        setMessages(prev => [
          ...prev,
          { sender: "bot", text: res.data.reply }
        ]);
      }

      // Reset input
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textInputRef.current) textInputRef.current.value = "";

    } catch (err) {
      console.error("❌ AI ERROR:", err.response?.data || err.message);

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "❌ AI processing failed!" }
      ]);
    }

    setLoading(false);
  };

  const handleFileChange = e => {
    if (e.target.files?.[0]) setSelectedImage(e.target.files[0]);
  };

  const removePreview = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="chatbox">
      <ChatHeader />

      {/* MESSAGE LIST */}
      <div className="messages">
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            sender={msg.sender}
            text={msg.text}
            image={msg.image}
            food={msg.food}
          />
        ))}

        {loading && <div className="loading">Đang xử lý...</div>}
      </div>

      {/* INPUT */}
      <div className="chat-input-wrapper">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          ref={textInputRef}
          onKeyDown={e => e.key === "Enter" && sendMessage(e.target.value)}
          disabled={loading}
          className="chat-input"
        />

        <label className="upload-btn">
          <span className="icon">📷</span> Chọn ảnh
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={loading}
          />
        </label>

        <button
          onClick={() => sendMessage(textInputRef.current?.value)}
          disabled={loading}
          className="chat-send-btn"
        >
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
