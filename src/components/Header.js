import React from "react";

const Header = ({ setActiveSection }) => {
  return (
    <header className="bg-blue-500 text-white p-4 mb-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="font-semibold text-xl">내 앱</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={() => setActiveSection("chat")}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition duration-300"
              >
                채팅
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("upload")}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition duration-300"
              >
                파일 업로드
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
