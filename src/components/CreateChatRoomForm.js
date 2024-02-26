import React, { useState } from "react";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";
import { FaCheck, FaTimes } from "react-icons/fa";

const CreateChatRoomForm = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const chatRoomData = {
      title,
      description,
      isPublic,
      password: isPublic ? undefined : password, // 공개 채팅방인 경우 비밀번호 제외
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(chatRoomData),
    };

    const url = "http://localhost:8000/chat-room"; // 채팅방 생성 API 엔드포인트
    const response = await fetchWithTokenRefresh(url, options);

    if (response.ok) {
      // 채팅방 생성 성공
      const data = await response.json(); // 성공 응답 데이터 처리
      console.log("Chat room created successfully", data);
      alert("채팅방 만들기 성공!");
      onCreate(); // 채팅방 목록 업데이트를 위해 상위 컴포넌트의 콜백 함수 호출
    } else {
      // 에러 처리
      const errorData = await response.json(); // 에러 응답 데이터 추출
      console.error("Failed to create chat room", errorData);
      alert(`채팅방 만들기 실패: ${errorData.message.join(", ")}`); // 에러 메시지 배열을 문자열로 변환하여 표시
    }
  };

  const handleCancel = () => {
    onCancel(); // 채팅방 생성 폼을 숨기고 채팅방 목록을 표시하기 위한 상위 컴포넌트의 함수 호출
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          style={{ fontSize: "1.125rem" }} // 글자 크기 조정
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="isPublic" className="flex items-center">
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-600">Is Public?</span>
        </label>
      </div>
      {!isPublic && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}
      <div className="flex justify-end">
        {" "}
        {/* 이 div로 버튼들을 감싸서 오른쪽 정렬 */}
        <button
          type="submit"
          className="inline-flex justify-center mr-2 py-2 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaCheck className="text-lg" /> {/* 아이콘 크기 조정 */}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <FaTimes className="text-lg" /> {/* 아이콘 크기 조정 */}
        </button>
      </div>
    </form>
  );
};

export default CreateChatRoomForm;
