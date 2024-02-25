import React, { useState } from "react";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";

const ChatRoomSearchAndJoin = ({ onJoinSuccess }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const url = `http://localhost:8000/chat-room/search?term=${encodeURIComponent(
      searchTerm
    )}`;
    const response = await fetchWithTokenRefresh(url, options);
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data); // API 응답 구조에 따라 적절하게 수정하세요.
    } else {
      alert("채팅방 검색 실패");
    }
  };

  const handleJoinRoom = async (roomId, password = "") => {
    const isPublic = password ? false : true;
    let bodyData = { isPublic };
    if (password) {
      bodyData.password = password;
    }
    console.log(bodyData);

    // 요청 옵션 설정
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(bodyData), // 수정된 부분: bodyData를 요청 본문으로 사용
    };

    // 요청 URL 설정
    const url = `http://localhost:8000/chat-room/${roomId}/join`; // 수정된 부분: 경로를 /join으로 명확히 지정
    const response = await fetchWithTokenRefresh(url, options);

    // 응답 처리
    if (response.ok) {
      alert("채팅방 가입 성공");
      onJoinSuccess();
    } else {
      const errorData = await response.json();
      console.log(`채팅방 가입 실패: ${errorData.message}`);
      alert(`채팅방 가입 실패: ${errorData.message}`);
    }
  };

  const promptForPasswordAndJoin = (roomId) => {
    const password = prompt(
      "이 채팅방은 비밀 채팅방입니다. 비밀번호를 입력해주세요."
    );
    if (password) {
      handleJoinRoom(roomId, password);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="mb-4 flex">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search chat rooms"
          className="rounded border-gray-300 mr-2 flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          🔍
        </button>
      </form>
      <ul>
        {searchResults.map((room) => (
          <li key={room.id} className="mb-2 flex justify-between items-center">
            <span>
              {room.title} {room.isPublic ? "" : "🔒"}
            </span>
            <button
              onClick={() =>
                room.isPublic
                  ? handleJoinRoom(room.id)
                  : promptForPasswordAndJoin(room.id)
              }
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomSearchAndJoin;
