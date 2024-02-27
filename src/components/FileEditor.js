import React, { useState, useEffect } from "react";
import { FaSave, FaRegQuestionCircle } from "react-icons/fa"; // 아이콘 추가
import Tooltip from "@material-ui/core/Tooltip"; // 툴팁을 위한 Material-UI 컴포넌트

const FileEditor = ({ selectedFile, onSave }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (selectedFile && selectedFile.readFileResult) {
      setContent(selectedFile.readFileResult);
    }
  }, [selectedFile]);

  const handleSave = () => {
    onSave({ ...selectedFile, readFileResult: content });
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
