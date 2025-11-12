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
  const textInputRef = useRef();

  const sendMessage = async (text = "") => {
    if (!text && !selectedImage) return alert("Nhập tin nhắn hoặc chọn ảnh");

    setLoading(true);

    // Hiển thị tin nhắn user
    const newMessages = [...messages];
    if (text) newMessages.push({ sender: "user", text });
    if (selectedImage)
      newMessages.push({ sender: "user", image: URL.createObjectURL(selectedImage) });
    setMessages(newMessages);

    try {
      let res;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        res = await axios.post("http://localhost:5000/image-analysis", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Nếu AI trả về danh sách món ăn JSON
        if (res.data.reply && Array.isArray(res.data.reply)) {
          const foodMessages = res.data.reply.map(food => ({
            sender: "bot",
            food
          }));
          setMessages(prev => [...prev, ...foodMessages]);
        } else {
          setMessages(prev => [...prev, { sender: "bot", text: res.data.reply }]);
        }

      } else {
        res = await axios.post("http://localhost:5000/chat", { message: text });
        setMessages(prev => [...prev, { sender: "bot", text: res.data.reply }]);
      }

      // Reset input và ảnh
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textInputRef.current) textInputRef.current.value = "";
    } catch (err) {
      console.error("❌ Lỗi khi gọi AI:", err.response?.data || err.message);
      setMessages(prev => [...prev, { sender: "bot", text: "❌ Lỗi khi gọi AI!" }]);
    }

    setLoading(false);
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) setSelectedImage(e.target.files[0]);
  };

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
            food={msg.food} // hỗ trợ object món ăn
          />
        ))}
        {loading && <div className="loading">Đang xử lý...</div>}
      </div>

      <div className="chat-input-wrapper">
  <input
    type="text"
    placeholder="Nhập tin nhắn..."
    ref={textInputRef}
    onKeyDown={e => { if (e.key === "Enter") sendMessage(e.target.value) }}
    disabled={loading}
    className="chat-input"
  />

  <label className="upload-btn">
  <span className="icon">📷</span>
  Chọn ảnh
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
