import React from "react";
import "../styles/notFoundPage.css"; // CSS 파일을 별도로 만들었다면 이렇게 import 합니다.

function NotFoundPage() {
  const rainDrops = Array.from({ length: 100 }).map((_, index) => (
    <div
      key={index}
      className="drop"
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 1}s`,
        animationDelay: `${Math.random() * 2}s`,
      }}
    />
  ));

  // 구름 개수와 위치를 조정할 수 있습니다.
  const clouds = [
    { className: "cloud small", style: { top: "5%", left: "10%" } },
    { className: "cloud medium", style: { top: "2%", left: "50%" } },
    { className: "cloud large", style: { top: "3%", right: "20%" } },
  ].map((cloud, index) => (
    <div key={index} className={cloud.className} style={cloud.style} />
  ));

  return (
    <div className="rain">
      {clouds}
      {rainDrops}
      <div className="message">
        <h1>404 Not Found</h1>
        <p>죄송합니다. 찾으시는 페이지를 찾을 수 없습니다.</p>
      </div>
    </div>
  );
}

export default NotFoundPage;
