import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const currentUserId = localStorage.getItem("userNickname"); // 현재 사용자의 닉네임 또는 식별자

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]); // 채팅방 멤버 목록
  const [selectedMember, setSelectedMember] = useState(""); // 선택된 귓속말 대상
  const chatContainerRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:8000/chat", {
      query: { token: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    socketRef.current.emit("join_room", { roomId });

    socketRef.current.on("room_info_with_members", (data) => {
      setMembers(data.members); // 서버로부터 받은 채팅방 멤버 정보 저장
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
      receiver: selectedMember, // 메시지의 대상이 되는 멤버의 닉네임
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

  return (
    <div className="chat-container p-4 max-w-xl mx-auto border rounded-lg shadow">
      <div
        className="messages overflow-y-auto h-96 mb-4 p-4 bg-gray-50 rounded-lg"
        ref={chatContainerRef}
      >
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
              {/* 다른 사람이 보낸 메시지일 경우 sender 표시 */}
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
            </div>
          </div>
        ))}
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
