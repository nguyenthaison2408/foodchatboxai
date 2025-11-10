import React from "react";
import "./ChatMessage.scss";

const ChatMessage = ({ sender, text, image }) => {
  return (
    <div className={`chat-message ${sender}`}>
      {image && <img src={image} alt="user-upload" className="chat-image" />}
      {text && <div className="chat-text">{text}</div>}
    </div>
  );
};

export default ChatMessage;
