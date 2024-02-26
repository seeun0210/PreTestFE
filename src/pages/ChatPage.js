import React, { useState } from "react";
import Chat from "../components/Chat";
import ChatRoomList from "../components/ChatRoomList";
import CreateChatRoomForm from "../components/CreateChatRoomForm";
import ChatRoomSearchAndJoin from "../components/ChatRoomSearchAndJoin"; // Import the search component

const ChatPage = () => {
  const [roomId, setRoomId] = useState("");
  const [showCreateRoomForm, setShowCreateRoomForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleEnterRoom = (id) => {
    setRoomId(id);
    setShowCreateRoomForm(false);
    setShowSearch(false);
  };

  const handleCreateRoom = (roomData) => {
    console.log(roomData);
    setShowCreateRoomForm(false);
    setShowSearch(false); // 검색 컴포넌트도 숨기기
  };

  const handleCancelCreateRoom = () => {
    setShowCreateRoomForm(false);
    setShowSearch(false); // 검색 컴포넌트도 숨기기
  };

  const toggleCreateRoomForm = () => {
    setShowCreateRoomForm((prev) => !prev);
    setShowSearch(false); // 검색 컴포넌트 숨기기
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setShowCreateRoomForm(false); // 생성 폼 숨기기
  };

  return (
    <div className="grid grid-cols-3 h-screen">
      <div className="col-span-1 border-r-2 border-gray-200 p-4">
        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center"
            onClick={toggleCreateRoomForm}
          >
            +
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 hover:bg-green-300 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center"
            onClick={toggleSearch}
          >
            🔍
          </button>
        </div>
        {showCreateRoomForm && (
          <CreateChatRoomForm
            onCreate={handleCreateRoom}
            onCancel={handleCancelCreateRoom}
          />
        )}
        {showSearch && (
          <ChatRoomSearchAndJoin onJoinSuccess={() => setShowSearch(false)} />
        )}
        {!showCreateRoomForm && !showSearch && (
          <ChatRoomList onEnterRoom={handleEnterRoom} />
        )}
      </div>
      <div className="col-span-2 p-4">
        {roomId ? <Chat roomId={roomId} /> : <div>Select a chat room</div>}
      </div>
    </div>
  );
};

export default ChatPage;
