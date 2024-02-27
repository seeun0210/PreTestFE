import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloud, FaComments, FaUpload, FaUser } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userNickname = localStorage.getItem("userNickname") || "사용자";

  const handleLogout = () => {
    localStorage.clear();

    navigate("/login"); // 로그인 페이지로 이동
  };

  const goToMainPage = () => {
    navigate("/"); // 채팅 페이지로 이동
  };

  return (
    <header className="bg-blue-500 text-white p-4 mb-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold text-xl cursor-pointer" onClick={goToMainPage}>
          <FaCloud className="inline" size={50} /> GROOM
        </h1>
        <div>
          <nav className="flex space-x-4 items-center">
            <button
              onClick={() => navigate("/chat")}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition duration-300 flex items-center"
            >
              <FaComments className="mr-2" /> 채팅
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition duration-300 flex items-center"
            >
              <FaUpload className="mr-2" /> 파일 업로드
            </button>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition duration-300 flex items-center"
              >
                <FaUser className="mr-2" />
                {userNickname} ▼
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 w-full text-left flex items-center"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
