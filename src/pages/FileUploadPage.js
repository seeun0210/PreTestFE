import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import FileEditor from "../components/FileEditor";
import FileTree from "../components/FileTree";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";
import { FaUpload, FaFileAlt } from "react-icons/fa";

const FileUploadPage = () => {
  const [uploadCounter, setUploadCounter] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileStructure, setFileStructure] = useState([]);
  const fileEditorRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // fetchWithTokenRefresh를 사용하여 API 호출
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
            <FileTree
              fileStructure={fileStructure}
              onSelectFile={setSelectedFile}
            />
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
