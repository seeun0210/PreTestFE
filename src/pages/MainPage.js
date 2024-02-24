import React, { useState } from "react";
import Header from "../components/Header";
import ChatPage from "./ChatPage";
import FileUploadPage from "./FileUploadPage";

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("chat");

  return (
    <div>
      <Header setActiveSection={setActiveSection} />
      <main>
        {activeSection === "chat" && <ChatPage />}
        {activeSection === "upload" && <FileUploadPage />}
      </main>
    </div>
  );
};

export default MainPage;
