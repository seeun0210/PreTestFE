import React, { useState } from "react";
import Header from "../components/Header";
import Chat from "../components/Chat";
import ChatRoomList from "../components/ChatRoomList";
import CreateChatRoomForm from "../components/CreateChatRoomForm";
import ChatRoomSearchAndJoin from "../components/ChatRoomSearchAndJoin"; // Import the search component
import { FaPlus, FaSearch } from "react-icons/fa";

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
    <>
      <Header
        toggleCreateRoomForm={toggleCreateRoomForm}
        toggleSearch={toggleSearch}
      />{" "}
      {/* 헤더에 함수 전달 */}
      <div className="grid grid-cols-3 h-screen ">
        <div className="col-span-1 border-r-2 border-gray-200 p-4">
          <div className="flex justify-between mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center rotate-on-hover"
              onClick={toggleCreateRoomForm}
            >
              <FaPlus /> {/* 아이콘으로 변경 */}
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center"
              onClick={toggleSearch}
            >
              <FaSearch /> {/* 아이콘으로 변경 */}
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
          {roomId ? (
            <Chat roomId={roomId} />
          ) : (
            <div className="flex items-center justify-center h-screen">
              <div className="col-span-2 p-4 flex justify-center items-center flex-col">
                <div className="flex items-center">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-2 ">
                  채팅방을 선택해주세요
                </div>
                <p className="text-gray-600">
                  좌측 메뉴에서 채팅방을 선택하거나, 새로운 채팅방을 생성할 수
                  있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
