import React, { useState } from "react";

const ChatRoomEntry = ({ onEnter }) => {
  const [roomId, setRoomId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim()) return;
    onEnter(roomId);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        className="border p-2 rounded-l"
        placeholder="채팅방 ID 입력..."
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
      >
        입장
      </button>
    </form>
  );
};

export default ChatRoomEntry;
