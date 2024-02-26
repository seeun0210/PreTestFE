import React, { useEffect, useState } from "react";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";

const ChatRoomList = ({ onEnterRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const url = "http://localhost:8000/chat-room";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      const response = await fetchWithTokenRefresh(url, options);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setChatRooms(data.chatRooms);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {chatRooms.map((room) => (
          <li key={room.id}>
            <div className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {room.title}
                  </p>
                  <button
                    onClick={() => onEnterRoom(room.id)}
                    className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    Enter
                  </button>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {room.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
