const fetchWithTokenRefresh = async (url, options) => {
  let response = await fetch(url, options);

  // 액세스 토큰 만료를 감지 (예: HTTP 상태 코드 401)
  if (response.status === 401) {
    // 새 액세스 토큰 요청
    const refreshed = await refreshToken();
    if (refreshed) {
      // 요청 헤더에 새 액세스 토큰 설정
      options.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "accessToken"
      )}`;
      // 요청 재시도
      response = await fetch(url, options);
    }
  }

  return response;
};

// 리프레시 토큰을 사용하여 새 액세스 토큰을 요청하는 함수
const refreshToken = async () => {
  try {
    const response = await fetch("http://localhost:8000/auth/token/access", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // 새 액세스 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", data.accessToken);
      return true;
    } else if (response.status === 401) {
      // 리프레시 토큰이 만료된 경우 로그아웃 처리
      logoutUser();
    }

    return false;
  } catch (error) {
    console.error("Token refresh error:", error);
    logoutUser();
    return false;
  }
};

// 사용자 로그아웃 처리 함수
const logoutUser = () => {
  // 로컬 스토리지에서 인증 토큰 제거
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userNickname");
  // 로그인 페이지로 이동 또는 로그아웃 상태 처리
  window.location.href = "/login"; // 예시 URL, 실제 프로젝트에 맞게 조정 필요
};

export default fetchWithTokenRefresh;
