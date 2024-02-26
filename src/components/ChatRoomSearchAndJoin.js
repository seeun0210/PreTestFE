import React, { useState } from "react";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";
import { FaSearch } from "react-icons/fa";
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
    let bodyData = {};
    if (password) {
      bodyData.password = password;
      bodyData.isPublic = false;
    } else {
      bodyData.isPublic = true;
    }

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(bodyData),
    };
    const url = `http://localhost:8000/chat-room/${roomId}/join`;
    const response = await fetchWithTokenRefresh(url, options);
    if (response.ok) {
      alert("채팅방 가입 성공");
      onJoinSuccess();
    } else {
      const errorData = await response.json();
      alert(`채팅방 가입 실패: ${errorData.message}`);
    }
  };

  const promptForPasswordAndJoin = (roomId) => {
    const password = prompt(
      "이 채팅방은 비밀 채팅방입니다. 비밀번호를 입력해주세요."
    );
    if (password !== null) {
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
          <FaSearch />
        </button>
      </form>{" "}
      <div className="overflow-auto h-[desired-height]">
        <table className="min-w-full max-w-[desired-width] divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Room Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {searchResults.length > 0 ? (
              searchResults.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="text-sm font-medium text-gray-900 truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {room.title} {room.isPublic ? "" : "🔒"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm text-gray-500  truncate "
                      style={{ maxWidth: "200px" }}
                    >
                      {room.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  검색결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChatRoomSearchAndJoin;
