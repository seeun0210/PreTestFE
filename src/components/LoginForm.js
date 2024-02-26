import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoToSignUp = () => {
    navigate("/signup"); // '/signup'은 회원가입 페이지의 경로로 가정
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    const token = btoa(`${email}:${password}`);

    try {
      const response = await fetch("http://localhost:8000/auth/signin", {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // 로그인 성공시 응답 처리

        // 로그인 성공 후 토큰과 사용자 닉네임을 로컬 스토리지에 저장
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userNickname", data.nickname); // 닉네임 저장

        // 환영 메시지 띄우기
        alert(`${data.nickname}님 안녕하세요!`);

        // 메인 페이지로 리다이렉트
        navigate("/chat");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-xs">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleLogin}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          아직 계정이 없으신가요?{" "}
          <button
            onClick={handleGoToSignUp}
            className="text-blue-500 hover:text-blue-800"
          >
            회원가입하러 가기
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
