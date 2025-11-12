import React from "react";
import "./ChatMessage.scss";

const ChatMessage = ({ sender, text, image, food }) => {
  if (food) {
    return (
      <div className={`chat-message bot`}>
        <div className="chat-food">
          <h4>{food.name}</h4>
          <p><strong>Loại:</strong> {food.type}</p>
          <p><strong>Thành phần:</strong> {food.ingredients.join(", ")}</p>
          <p>
            <strong>Dinh dưỡng:</strong> 
            Calories {food.nutrition.calories}, 
            Protein {food.nutrition.protein}g, 
            Fat {food.nutrition.fat}g, 
            Carbs {food.nutrition.carbs}g
          </p>
          <p><strong>Gợi ý món tương tự:</strong> {food.suggestions.join(", ")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-message ${sender}`}>
      {image && <img src={image} alt="user-upload" className="chat-image" />}
      {text && <div className="chat-text">{text}</div>}
    </div>
  );
};

export default ChatMessage;
