import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import moment from "moment"; // 날짜 처리를 위한 라이브러리

const currentUserId = localStorage.getItem("userNickname");

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const chatContainerRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:8000/chat", {
      query: { token: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    socketRef.current.emit("join_room", { roomId });

    socketRef.current.on("room_info_with_members", (data) => {
      setMembers(data.members);
    });

    socketRef.current.on("chat_history", (chatLogs) => {
      setMessages(chatLogs);
      scrollToBottom();
    });

    socketRef.current.on("message", (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload = {
      message,
      roomId,
      receiver: selectedMember,
    };

    socketRef.current.emit("message", payload);
    setMessage("");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  // 날짜별로 메시지를 구분하여 렌더링하는 함수
  const renderMessages = () => {
    const groupedMessages = messages.reduce((acc, message) => {
      const date = moment(message.createdAt).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});

    return Object.entries(groupedMessages).map(([date, messages]) => (
      <div key={date}>
        <div className="text-center text-gray-600 my-2">
          {moment(date).format("LL")}
        </div>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message mb-2 last:mb-0 p-2 rounded-md shadow ${
              msg.sender === currentUserId ? "bg-blue-100" : "bg-white"
            } ${msg.receiver ? "bg-green-100" : ""}`}
          >
            <div
              className={`text-sm ${
                msg.sender === currentUserId ? "text-right" : ""
              }`}
            >
              {msg.sender !== currentUserId && (
                <div className="text-gray-500 text-xs mb-1">{msg.sender}</div>
              )}
              {msg.receiver && (
                <span className="text-green-600">
                  (속닥속닥) @
                  {msg.receiver === currentUserId ? "당신에게" : msg.receiver}
                </span>
              )}
              {` ${msg.message}`}
              <div className="text-xs text-gray-400">
                {moment(msg.createdAt).format("LT")}
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="chat-container p-4 max-w-xl mx-auto border rounded-lg shadow">
      <div
        className="messages overflow-y-auto h-96 mb-4 p-4 bg-gray-50 rounded-lg"
        ref={chatContainerRef}
      >
        {renderMessages()}
      </div>
      <div className="mb-4">
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className="rounded border-gray-300 mr-2"
        >
          <option value="">모두에게</option>
          {members
            .filter((member) => member.nickname !== currentUserId)
            .map((member) => (
              <option key={member.id} value={member.nickname}>
                {member.nickname}
              </option>
            ))}
        </select>
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
