import React, { useState, useEffect } from "react";
import { FaSave, FaRegQuestionCircle } from "react-icons/fa"; // 아이콘 추가
import Tooltip from "@material-ui/core/Tooltip"; // 툴팁을 위한 Material-UI 컴포넌트
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";

const FileEditor = ({ selectedFile, onSave }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  useEffect(() => {
    if (selectedFile && selectedFile.readFileResult) {
      setContent(selectedFile.readFileResult);
    }
  }, [selectedFile]);

  const handleSave = async () => {
    setIsLoading(true); // 저장 시작 시 로딩 상태 활성화
    const url = "http://localhost:8000/file";
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 이 부분은 fetchWithTokenRefresh 내부에서 처리될 것입니다.
      },
      body: JSON.stringify({
        readFileResult: content, // 수정된 파일 내용
        fullyDecoded: selectedFile.fullyDecoded, // 파일 경로
      }),
    };

    try {
      const response = await fetchWithTokenRefresh(url, options);
      if (response.ok) {
        const updatedData = await response.json(); // 응답 데이터 처리
        setContent(updatedData.readFileResult); // 응답으로 받은 데이터로 상태 업데이트
        onSave(updatedData); // 부모 컴포넌트에 업데이트된 데이터 전달
        alert("파일이 성공적으로 업데이트 되었습니다.");
      } else {
        alert("파일 업데이트에 실패하였습니다.");
      }
    } catch (error) {
      console.error("파일 업데이트 중 에러 발생:", error);
    } finally {
      setIsLoading(false); // 작업 완료 후 로딩 상태 비활성화
    }
  };

  // 파일 경로를 처리하여 UI에 표시하기 위한 함수
  const renderFilePath = (path) => {
    const parts = path.split("/").filter((part) => part.length > 0); // 경로 분할 및 필터링
    return parts.map((part, index) => (
      <Tooltip title={part} key={index}>
        <span className="mr-2 cursor-pointer text-blue-500 hover:text-blue-700">
          {part.length > 10 ? `${part.substring(0, 10)}...` : part}{" "}
          {/* 긴 이름은 자르기 */}
        </span>
      </Tooltip>
    ));
  };

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중 표시
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="flex items-center flex-wrap">
        {selectedFile.fullyDecoded
          ? renderFilePath(selectedFile.fullyDecoded)
          : "파일 경로"}
        <FaRegQuestionCircle className="ml-2 text-gray-400" />
      </h2>
      <textarea
        className="w-full h-64 p-2 border border-gray-300 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center justify-center"
        onClick={handleSave}
      >
        <FaSave className="mr-2" />
        저장
      </button>
    </div>
  );
};

export default FileEditor;
