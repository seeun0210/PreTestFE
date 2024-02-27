import React, { useState } from "react";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";
import { FaUpload } from "react-icons/fa"; // React Icons에서 업로드 아이콘 가져오기

const FileUpload = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null); // 에러 메시지 초기화
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    const controller = new AbortController(); // AbortController 인스턴스 생성
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 후 요청 취소

    const options = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      signal: controller.signal, // fetch 요청에 signal 옵션 추가
    };

    try {
      const response = await fetchWithTokenRefresh(
        `${process.env.REACT_APP_BE_URLs}/file`,
        options
      );

      clearTimeout(timeoutId); // 요청이 성공적으로 완료되면 타이머 취소

      if (response.ok) {
        const data = await response.json();
        onUploadSuccess(data);
        alert("파일 업로드에 성공하였습니다.");
      } else {
        const errorData = await response.json();
        setErrorMessage(`Upload failed: ${errorData.message}`);
        onUploadSuccess(false);
      }
    } catch (error) {
      clearTimeout(timeoutId); // 에러 발생 시 타이머 취소
      if (error.name === "AbortError") {
        setErrorMessage("Upload failed: Server response timed out");
      } else {
        setErrorMessage(`Upload failed: ${error.message}`);
      }
      onUploadSuccess(false);
    } finally {
      setIsUploading(false);
      setSelectedFile(null); // 파일 선택 상태 초기화
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-4 text-red-600 bg-red-100 rounded-lg">
          {errorMessage}
        </div>
      )}
      {isUploading && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-blue-500 animate-pulse"></div>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <FaUpload className="mr-2" /> Upload
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
