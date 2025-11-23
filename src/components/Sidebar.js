import React, { useState } from "react";
import "./ChatUI.scss";

const Sidebar = ({ chats = [], activeId, onSelect, onNewChat, onDelete, onRename }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = (id) => {
    onDelete && onDelete(id);
    setOpenMenuId(null);
  };

  const handleRename = (id) => {
    const newName = prompt("Nhập tên mới cho chat:");
    if (newName && onRename) {
      onRename(id, newName); // gọi callback để update Firestore
    }
    setOpenMenuId(null);
  };

  return (
    <div className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>

      <div className="chat-history">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${activeId === chat.id ? "active" : ""}`}
            onClick={() => onSelect(chat.id)}
          >
            <span className="chat-item-title">{chat.title || "Untitled chat"}</span>

            <div className="chat-options-wrapper">
              <button
                className="options-btn"
                onClick={e => {
                  e.stopPropagation();
                  toggleMenu(chat.id);
                }}
              >
                ⋮
              </button>

              {openMenuId === chat.id && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={() => handleRename(chat.id)}>Rename</div>
                  <div className="dropdown-item" onClick={() => handleDelete(chat.id)}>Delete</div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
