import React from "react";
import Header from "../components/Header";
import { FaComments, FaUserPlus } from "react-icons/fa"; // 리액트 아이콘 라이브러리에서 아이콘 import
import "../styles/mainPage.css"; // 추가된 CSS 파일

const MainPage = () => {
  return (
    <>
      <Header />
      <div className="app-container">
        <main>
          <section className="main-section">
            <h1 className="page-title">
              <FaComments className="icon" /> Welcome to GROOM
            </h1>
            <p className="welcome-message">
              Start chatting with friends and join interesting chat rooms!
            </p>
            <p className="app-intro">
              GROOM is a platform where you can discover and join various chat
              rooms on different topics. Whether you're interested in
              technology, sports, or music, there's a chat room for you!
            </p>
            <div className="call-to-action">
              <button className="create-room-button">
                <FaUserPlus className="button-icon" /> Get started by creating
                your own chat room!
              </button>
              <button className="join-room-button">
                <FaComments className="button-icon" /> Join existing chat rooms
                and start chatting now!
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MainPage;
