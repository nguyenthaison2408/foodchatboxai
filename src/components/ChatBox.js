import React, { useState, useRef, useEffect } from "react";
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import "./ChatUI.scss";
import axios from "axios";

const API = "http://localhost:5000";

const ChatBox = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const textInputRef = useRef();
  const fileInputRef = useRef();

  // ===== Load chats realtime từ Firestore =====
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), messages: doc.data().messages || [] }));
      setChatSessions(chats);
      if (!activeChatId && chats.length > 0) setActiveChatId(chats[0].id);
    });
    return () => unsubscribe();
  }, [activeChatId]);

  const currentChat = chatSessions.find(c => c.id === activeChatId) || { messages: [] };

  // ===== Tạo chat mới =====
  const newChat = async () => {
    try {
      const docRef = await addDoc(collection(db, "chats"), {
        title: "New Chat",
        messages: [],
        createdAt: serverTimestamp()
      });
      setActiveChatId(docRef.id);
    } catch (err) {
      console.error("New chat failed:", err);
    }
  };

  // ===== Xóa chat =====
  const deleteChat = async (id) => {
    try {
      await deleteDoc(doc(db, "chats", id));
      if (id === activeChatId) setActiveChatId(chatSessions[0]?.id || null);
    } catch (err) {
      console.error("Delete chat failed:", err);
    }
  };

  // ===== Rename chat & update Firestore =====
  const renameChat = async (id, newName) => {
    try {
      const chatRef = doc(db, "chats", id);
      await updateDoc(chatRef, { title: newName });

      // cập nhật state local để UI thay đổi ngay
      setChatSessions(prev =>
        prev.map(chat => chat.id === id ? { ...chat, title: newName } : chat)
      );
    } catch (err) {
      console.error("Rename chat failed:", err);
    }
  };

  // ===== Cập nhật messages =====
  const updateMessages = async (newMessages) => {
    try {
      const chatRef = doc(db, "chats", activeChatId);
      await updateDoc(chatRef, { messages: newMessages });
    } catch (err) {
      console.error("Update messages failed:", err);
    }
  };

  // ---------------- SEND MESSAGE -----------------
  const sendMessage = async (text = "") => {
    if (!text && !selectedImage) return;
    setLoading(true);

    const updated = [...(currentChat.messages || [])];
    if (text) updated.push({ sender: "user", text });
    if (selectedImage) updated.push({ sender: "user", image: URL.createObjectURL(selectedImage) });

    await updateMessages(updated);

    try {
      let res;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("chatId", activeChatId);

        res = await axios.post(`${API}/image-analysis`, formData, { headers: { "Content-Type": "multipart/form-data" } });

        const botMsgs = Array.isArray(res.data)
          ? res.data.filter(m => m.sender === "bot")
          : [{ sender: "bot", text: res.data.reply || "⚠️ AI không trả lời." }];

        await updateMessages([...updated, ...botMsgs]);
      } else {
        res = await axios.post(`${API}/chat`, { chatId: activeChatId, message: text });
        const botMsg = { sender: "bot", text: res.data.reply || "⚠️ AI không trả lời." };
        await updateMessages([...updated, botMsg]);
      }

      setSelectedImage(null);
      textInputRef.current.value = "";
      fileInputRef.current.value = "";

    } catch (err) {
      console.error("AI processing failed:", err);
      await updateMessages([...updated, { sender: "bot", text: "❌ AI processing failed!" }]);
    }

    setLoading(false);
  };

  return (
    <div className="layout">
      <Sidebar
        chats={chatSessions}
        activeId={activeChatId}
        onSelect={setActiveChatId}
        onNewChat={newChat}
        onDelete={deleteChat}
        onRename={renameChat}  /* truyền callback rename */
      />

      <div className="chatbox">
        <ChatHeader />

        <div className="messages">
          {(currentChat.messages || []).map((msg, i) => (
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
            📷
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={e => setSelectedImage(e.target.files[0])}
            />
          </label>
          <button
            onClick={() => sendMessage(textInputRef.current.value)}
            className="chat-send-btn"
          >
            Gửi
          </button>
        </div>

        {selectedImage && (
          <div className="preview">
            <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
            <img src={URL.createObjectURL(selectedImage)} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
