import React, { useState } from "react";
import { FaFolder, FaFolderOpen, FaFile, FaSpinner } from "react-icons/fa";
import fetchWithTokenRefresh from "../utils/apis/FetchWithRefreshToken";

const FileTree = ({ fileStructure, onSelectFile }) => {
  const [openFolders, setOpenFolders] = useState({});
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 관리하기 위한 상태 추가

  const toggleFolder = (name) => {
    setOpenFolders((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const generateFilePath = (node, path = "") => {
    if (!node.parent) {
      return `/${node.name}`;
    }
    const newPath = `${node.parent}/${node.name}`;
    return path ? `${newPath}/${path}` : newPath;
  };

  const handleFileDoubleClick = async (node) => {
    if (isLoading) return; // 로딩 중에는 추가 요청을 방지

    setIsLoading(true); // 파일 불러오기 시작 시 로딩 상태를 true로 설정
    const filepath = generateFilePath(node);
    const encodedFilepath = encodeURIComponent(filepath);
    try {
      const response = await fetchWithTokenRefresh(
        `${process.env.REACT_APP_BE_URL}/file/content`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "x-filepath": encodedFilepath,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          alert("불러올 수 없는 파일입니다."); // 404 Not Found 응답 처리
        } else {
          throw new Error("Network response was not ok.");
        }
      }

      const data = await response.json();
      onSelectFile(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false); // 요청이 완료되면 로딩 상태를 false로 설정
    }
  };

  const renderTree = (nodes, depth = 0, parentPath = "") =>
    nodes.map((node) => {
      const isOpen = openFolders[node.name];
      const displayName =
        node.name.length < 30 ? node.name : `${node.name.substring(0, 25)}...`;
      const nodeStyle = {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        paddingLeft: `${depth * 20}px`,
        userSelect: "none",
        fontSize: "18px",
      };

      const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

      if (node.type === "directory") {
        return (
          <div key={node.name} style={{ marginBottom: "5px" }}>
            <div
              onClick={() => toggleFolder(node.name)}
              style={nodeStyle}
              title={node.name}
            >
              {isOpen ? (
                <FaFolderOpen
                  style={{ marginRight: "5px", color: "#fbbf24" }}
                />
              ) : (
                <FaFolder style={{ marginRight: "5px", color: "#fbbf24" }} />
              )}
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </span>
            </div>
            {isOpen && renderTree(node.children, depth + 1, currentPath)}
          </div>
        );
      } else {
        return (
          <div
            key={node.name}
            onDoubleClick={() =>
              handleFileDoubleClick({ ...node, parent: parentPath })
            }
            style={nodeStyle}
            title={node.name}
          >
            <FaFile style={{ marginRight: "5px", color: "#3b82f6" }} />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </span>
          </div>
        );
      }
    });

  return (
    <div className="font-sans text-base">
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaSpinner className="animate-spin" style={{ marginRight: "5px" }} />
          Loading...
        </div>
      ) : fileStructure.length ? (
        renderTree(fileStructure)
      ) : (
        "No files found."
      )}
    </div>
  );
};

export default FileTree;
