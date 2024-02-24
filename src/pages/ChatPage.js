import React, { useState } from "react";
import Chat from "../components/Chat"; // Chat 컴포넌트 임포트
import ChatRoomEntry from "../components/ChatRoomEntry"; // ChatRoomEntry 컴포넌트 임포트

const ChatPage = () => {
  const [roomId, setRoomId] = useState("");

  const handleEnterRoom = (id) => {
    setRoomId(id);
  };

  return (
    <div className="chat-page p-4">
      <h1 className="text-xl font-bold mb-4">채팅 페이지</h1>
      {!roomId && <ChatRoomEntry onEnter={handleEnterRoom} />}
      {roomId && <Chat roomId={roomId} />}
    </div>
  );
};

export default ChatPage;
