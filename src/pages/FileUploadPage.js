import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import FileEditor from "../components/FileEditor";
import FileTree from "../components/FileTree";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";
import { FaUpload, FaFileAlt } from "react-icons/fa";
// 로딩 애니메이션을 위한 CSS 스타일
import "../styles/loadingSpinner.css"; // 필요한 경우 경로를 수정하세요.

const FileUploadPage = () => {
  const [uploadCounter, setUploadCounter] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileStructure, setFileStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // 로딩 시작
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetchWithTokenRefresh(
        "http://localhost:8000/file",
        options
      );
      if (response.ok) {
        const data = await response.json();
        setFileStructure(data); // 데이터 설정
      } else {
        console.error("Failed to fetch file structure");
      }
      setIsLoading(false); // 로딩 종료
    };

    fetchData();
  }, [uploadCounter]);

  const handleUploadSuccess = () => {
    setUploadCounter((prev) => prev + 1);
  };

  const onSelectFile = (fileContent) => {
    setSelectedFile(fileContent);
  };

  return (
    <>
      <Header />
      <div className="flex p-4 gap-4">
        {/* Left Column */}
        <div className="w-1/3 space-y-4">
          <h1 className="text-xl font-bold mb-4">파일 업로드</h1>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">파일 구조</h2>
            {isLoading ? (
              <div className="loading-spinner"></div> // 로딩 애니메이션 표시
            ) : (
              <FileTree
                fileStructure={fileStructure}
                onSelectFile={setSelectedFile}
              />
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/3 space-y-4">
          {selectedFile ? (
            <FileEditor
              selectedFile={selectedFile}
              onSave={(editedContent) => console.log(editedContent)}
            />
          ) : (
            <div className="text-center py-8 bg-white shadow rounded-lg">
              파일을 선택하세요.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUploadPage;
