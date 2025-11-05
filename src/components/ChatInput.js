import React, { useState } from "react";
import "./ChatInput.scss";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleSend = () => {
    if (!text && !image) return;
    onSend(text, image);
    setText("");
    setImage(null);
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Nhập câu hỏi hoặc chọn ảnh món ăn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleSend}>Gửi</button>
    </div>
  );
};

export default ChatInput;
