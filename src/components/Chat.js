import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";
import io from "socket.io-client";
import moment from "moment"; // 날짜 처리를 위한 라이브러리
import { FaPaperPlane, FaDoorOpen } from "react-icons/fa"; // 나가기 아이콘 추가

const currentUserId = localStorage.getItem("userNickname");
const MAX_MESSAGE_LENGTH = 100;
const Chat = ({ roomId }) => {
  const [roomTitle, setRoomTitle] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [expandedMessages, setExpandedMessages] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const chatContainerRef = useRef(null);
  const socketRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io("http://localhost:8000/chat", {
      query: { token: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    socketRef.current.emit("join_room", { roomId });

    socketRef.current.on("room_info_with_members", (data) => {
      console.log(data);
      setMembers(data.members);
      setRoomTitle(data.title); // 채팅방 제목 업데이트
      setRoomDescription(data.description); // 채팅방 설명 업데이트
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
  //채팅방 나가기
  const handleLeaveRoom = async () => {
    const isConfirmed = window.confirm(
      "정말로 나가겠습니까?\n채팅방에서 나가면 채팅 목록에서도 사라집니다."
    );
    if (!isConfirmed) {
      return; // 사용자가 취소를 클릭한 경우
    }

    const url = `http://localhost:8000/chat-room/${roomId}/leave`; // 실제 나가기 API 엔드포인트
    const options = {
      method: "PATCH", // 요청 메소드
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 초기 액세스 토큰
      },
    };

    try {
      const response = await fetchWithTokenRefresh(url, options); // 수정된 함수 사용
      if (response.ok) {
        // 채팅방 나가기 성공
        alert("채팅방에서 성공적으로 나갔습니다.");
        navigate("/chat");
      } else {
        // 요청 실패 처리
        throw new Error("채팅방 나가기 실패");
      }
    } catch (error) {
      console.error(error);
      alert("채팅방 나가기 중 문제가 발생했습니다.");
    }
  };

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

    const toggleMessageExpand = (msgId) => {
      setExpandedMessages((prevState) => ({
        ...prevState,
        [msgId]: !prevState[msgId],
      }));
    };

    return Object.entries(groupedMessages).map(([date, messages]) => (
      <div key={date}>
        <div className="text-center text-gray-600 my-2">
          {moment(date).format("LL")}
        </div>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender === currentUserId ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`message p-2 rounded-md shadow ${
                msg.receiver
                  ? "bg-green-100"
                  : msg.sender === currentUserId
                  ? "bg-blue-100"
                  : "bg-white"
              }`}
              style={{ maxWidth: "80%" }}
            >
              <div className="text-sm" style={{ overflow: "hidden" }}>
                <div
                  style={{
                    maxHeight: expandedMessages[msg._id] ? "none" : "4em",
                    overflow: "hidden",
                  }}
                >
                  {msg.sender !== currentUserId && (
                    <div className="text-gray-500 text-xs mb-1">
                      {msg.sender}
                    </div>
                  )}
                  {msg.receiver && (
                    <span className="text-green-600">
                      (속닥속닥) @
                      {msg.receiver === currentUserId
                        ? "당신에게"
                        : msg.receiver}
                    </span>
                  )}
                  {` ${msg.message}`}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-400">
                    {moment(msg.createdAt).format("LT")}
                  </div>
                  {msg.message.length > MAX_MESSAGE_LENGTH && (
                    <button
                      onClick={() => toggleMessageExpand(msg._id)}
                      className="text-xs text-blue-500"
                    >
                      {expandedMessages[msg._id] ? "줄이기" : "전체보기"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <>
      <div className="chat-room-header p-6 border-b text-center grid grid-cols-6 items-center">
        <div className="col-span-1" />
        <div className="col-span-3">
          <h2 className="text-xl font-semibold">{roomTitle}</h2>
          <p className="text-gray-600">{roomDescription}</p>
        </div>
        <div className="flex justify-end col-span-1">
          <button
            onClick={handleLeaveRoom}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
          >
            <FaDoorOpen />
          </button>
        </div>
        <div className="col-span-1" />
      </div>

      <div className="chat-container p-4 max-w-xl mx-auto border rounded-lg shadow">
        <div
          className="messages overflow-y-auto h-96 mb-4 p-4 bg-gray-50 rounded-lg"
          style={{ height: "600px" }}
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
            className="send-button bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-r-lg transition-colors duration-200 flex items-center justify-center"
          >
            <FaPaperPlane /> {/* 아이콘으로 변경 */}
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
