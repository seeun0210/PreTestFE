import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null); // 메시지 목록의 끝을 참조하기 위한 ref

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // 메시지가 추가될 때마다 스크롤을 아래로 이동
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message }]);
    setMessage("");
  };

  return (
    <div className="chat-container p-4 max-w-xl mx-auto border rounded-lg shadow">
      <div className="messages overflow-y-auto h-96 mb-4 p-4 bg-gray-50 rounded-lg">
        {" "}
        {/* 채팅창 높이를 h-96로 변경 */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="message mb-2 last:mb-0 p-2 bg-white rounded-md shadow"
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 메시지 목록의 끝을 나타내는 요소 */}
      </div>
      <form className="message-form flex" onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력..."
          className="message-input flex-1 border rounded-l-lg p-2 mr-2 outline-none"
        />
        <button
          type="submit"
          className="send-button bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-r-lg transition-colors duration-200"
        >
          보내기
        </button>
      </form>
    </div>
  );
};

export default Chat;
