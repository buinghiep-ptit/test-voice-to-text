import React, { useState } from "react";
import "./TabBar.css";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onTabClick: (tab: string) => void;
  foxskill?: string | null;
}

interface ReactNativeWebViewWindow extends Window {
  ReactNativeWebView?: {
    postMessage: (data: string) => void;
  };
}

const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  onTabClick,
  foxskill,
}) => {
  const tabs = [
    ...(foxskill ? [{ id: "foxskill", label: "Học cùng chang" }] : []),
    { id: "info", label: "Tra cứu HĐ" },
    { id: "service", label: "Tra cứu FPT Play" },
    { id: "task", label: "Xử lý tác vụ" },
  ];

  const [isExpanded, setIsExpanded] = useState(true);

  const handleFoxskillTabClick = () => {
    // Send postMessage to React Native
    const reactNativeWebView = (window as ReactNativeWebViewWindow)
      .ReactNativeWebView;
    if (reactNativeWebView) {
      reactNativeWebView.postMessage(
        JSON.stringify({
          type: "FOXSKILL",
          value: "OPEN_FOXSKILL",
        })
      );
    } else if (window.parent) {
      window.parent.postMessage(
        {
          type: "FOXSKILL",
          value: "OPEN_FOXSKILL",
        },
        "*"
      );
    }
  };

  const handleExpandClick = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="tab-bar-container">
      <button
        className="expand-toggle-btn"
        style={{
          background: "none",
          border: "none",
          marginLeft: 0,
          marginBottom: "6px",
          marginTop: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          fontWeight: 600,
          fontSize: "1rem",
          color: "rgb(32, 59, 220)",
          transition: "background 0.2s, color 0.2s",
          borderRadius: 6,
        }}
        aria-label={isExpanded ? "Thu gọn tab" : "Mở rộng tab"}
        onClick={handleExpandClick}
        type="button"
      >
        <span>Truy cập nhanh</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            transition: "transform 0.2s",
            transform: isExpanded ? "rotate(180deg)" : "none",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 8L10 12L14 8"
              stroke="#6c757d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`tab-bar tab-bar-expandable${
          isExpanded ? " expanded" : " !pb-0"
        }`}
        style={{
          maxHeight: isExpanded ? 48 : 0,
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? "auto" : "none",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => {
              if (tab.id === "foxskill") {
                handleFoxskillTabClick();
              } else {
                onTabChange(tab.id);
                onTabClick(tab.id);
              }
            }}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
