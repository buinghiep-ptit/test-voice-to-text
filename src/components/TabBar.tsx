import React from "react";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onTabClick: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  onTabClick,
}) => {
  const tabs = [
    { id: "info", label: "Thông tin KH" },
    { id: "service", label: "Dịch vụ FPT play" },
    { id: "task", label: "Xử lý tác vụ" },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    onTabClick(tabId);
  };

  return (
    <div className="tab-bar-container">
      <span>Bạn muốn tra cứu?</span>
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
