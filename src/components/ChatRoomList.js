import React, { useEffect, useState } from "react";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";
import { MdLogin } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import moment from "moment";

const ChatRoomList = ({ onEnterRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const userNickname = localStorage.getItem("userNickname"); // localStorage에서 userNickname 가져오기

  useEffect(() => {
    const fetchChatRooms = async (retryCount = 0) => {
      const url = "http://localhost:8000/chat-room";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      try {
        const response = await fetchWithTokenRefresh(url, options);
        if (response.ok) {
          const data = await response.json();
          console.log(data.chatRooms);
          setChatRooms(data.chatRooms);
        } else {
          throw new Error("Failed to fetch chat rooms");
        }
      } catch (error) {
        if (retryCount < 3) {
          console.log(`Retrying... Attempt ${retryCount + 1}`);
          fetchChatRooms(retryCount + 1);
        } else {
          console.error("Failed to fetch chat rooms after 3 attempts");
        }
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div className="chat-room-list bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {chatRooms.map((room) => (
          <li key={room.id}>
            <div className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600 truncate">
                    {room.title}
                    {room.admin.nickname === userNickname && (
                      <FaCrown className="inline text-yellow-500" size="16" />
                    )}
                    <br />
                    <span className="text-xs text-gray-500">
                      {moment(room.updatedAt).fromNow()}
                    </span>
                  </div>

                  <button
                    onClick={() => onEnterRoom(room.id)}
                    className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                  >
                    <MdLogin size="20" />
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
