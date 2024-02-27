import React from "react";
import { Link } from "react-router-dom"; // react-router-dom에서 Link 컴포넌트 import
import Header from "../components/Header";
import { FaComments, FaUserPlus, FaUpload } from "react-icons/fa"; // 아이콘 추가
import "../styles/mainPage.css"; // 추가된 CSS 파일

const MainPage = () => {
  return (
    <>
      <Header />
      <div className="app-container">
        <main>
          <section className="main-section">
            <h1 className="page-title">PreTest</h1>
            <p className="welcome-message">
              Explore the world of chat, create chat rooms, whisper, and manage
              your files!
            </p>
            <p className="app-intro">
              This App offers a dynamic platform for chatting, creating your own
              chat rooms on a variety of topics, and engaging in private
              whispers. Additionally, This App provides functionalities to
              upload and edit files, making collaboration and sharing easier
              than ever. Join today to start discovering and connecting!
            </p>
            <div className="call-to-action">
              <Link to="/chat" className="create-room-button">
                <FaUserPlus className="button-icon" /> Start or join a chat
                room!
              </Link>
              <Link to="/upload" className="join-room-button">
                <FaUpload className="button-icon" /> Manage your files here
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MainPage;
