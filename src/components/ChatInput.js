import React, { useState } from "react";
import "./ChatUI.scss";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleSend = () => {
    if (!text && !image) return;
    onSend(text, image);
    setText("");
    setImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-input">
  <input
    type="text"
    placeholder="Nhập câu hỏi hoặc chọn ảnh món ăn..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={handleKeyDown}
  />

  {/* Button tùy chỉnh cho upload ảnh */}
  <label className="upload-btn">
    📷 Chọn ảnh
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setImage(e.target.files[0])}
      style={{ display: "none" }}
    />
  </label>

  <button onClick={handleSend}>Gửi</button>
</div>

  );
};

export default ChatInput;
