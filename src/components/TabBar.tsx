/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import "./TabBar.css";
import FAQModal, { FAQCategory } from "./FAQModal";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onTabClick: (tab: string) => void;
  foxskill?: string | null;
  token?: string;
  isWebview?: string | null;
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
  token,
  isWebview,
}) => {
  const [dynamicCategories, setDynamicCategories] = useState<FAQCategory[]>([]);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(
    null,
  );
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_APP_URL || "";
        const response = await fetch(`${baseUrl}/api/sdk/faq-category`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              token ||
              "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhZ2VudF91c2VyX2lkX2tleSI6MTQ3LCJhdXRoIjoic3VwZXJfYWRtaW4iLCJlbWFpbCI6InN0YWdfaG9hbmdudjEzNEBmcHQuY29tIiwib3JnYW5pemF0aW9uIjoiRlRFTC9GVEVMSU1VL0RTQy9EU0NSQS8iLCJpYXQiOjE3NzA1NDg1MjYsImV4cCI6MTc3MDU5MTcyNn0.x9JVhJetOh_XVGnFztsVeSYIzvsyZ1XUgrJhIX0yVDj6KDJbExX2hJhT5g0BOAutqteYcD-bUnbPExvF2V0QKg"
            }`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDynamicCategories(
            Array.isArray(data) ? data : data.data ? data.data : [],
          );
        }
      } catch (error) {
        console.error("Failed to fetch FAQ categories", error);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const tabs = [
    ...(foxskill ? [{ id: "foxskill", label: "Học cùng Chang" }] : []),
    { id: "info", label: "Tra cứu HĐ" },
    { id: "service", label: "Tra cứu FPT Play" },
    { id: "task", label: "Xử lý tác vụ" },
    ...dynamicCategories.map((cat) => ({
      id: `faq-${cat.id}`,
      label: cat.name,
      isDynamic: true,
      data: cat,
    })),
  ];

  const [isExpanded, setIsExpanded] = useState(true);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabBarRef.current) return;
    isDown.current = true;
    isDragging.current = false;
    tabBarRef.current.classList.add("active-drag");
    startX.current = e.pageX - tabBarRef.current.offsetLeft;
    scrollLeft.current = tabBarRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    tabBarRef.current?.classList.remove("active-drag");
  };

  const handleMouseUp = () => {
    isDown.current = false;
    tabBarRef.current?.classList.remove("active-drag");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !tabBarRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabBarRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // scroll-speed
    if (Math.abs(walk) > 5) {
      isDragging.current = true;
    }
    tabBarRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleFoxskillTabClick = () => {
    // Send postMessage to React Native
    const reactNativeWebView = (window as ReactNativeWebViewWindow)
      .ReactNativeWebView;
    if (reactNativeWebView) {
      reactNativeWebView.postMessage(
        JSON.stringify({
          type: "FOXSKILL",
          value: "OPEN_FOXSKILL",
        }),
      );
    } else if (window.parent) {
      window.parent.postMessage(
        {
          type: "FOXSKILL",
          value: "OPEN_FOXSKILL",
        },
        "*",
      );
    }
  };

  const handleExpandClick = () => {
    setIsExpanded((prev) => !prev);
  };

  const updateArrows = () => {
    if (tabBarRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabBarRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [tabs.length, isExpanded]);

  const scroll = (direction: "left" | "right") => {
    if (tabBarRef.current) {
      const scrollAmount = 200;
      tabBarRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
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
        <div className="tab-bar-wrapper">
          <div
            ref={tabBarRef}
            className={`tab-bar tab-bar-expandable${
              isExpanded ? " expanded" : " pb-0!"
            }`}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onScroll={updateArrows}
            style={{
              maxHeight: isExpanded ? 48 : 0,
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? "auto" : "none",
              transition:
                "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
              overflowX: "auto",
              whiteSpace: "nowrap",
              cursor: isDown.current ? "grabbing" : "pointer",
              userSelect: isDown.current ? "none" : "auto",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={(e) => {
                  if (isDragging.current) {
                    e.preventDefault();
                    return;
                  }
                  if (tab.id === "foxskill") {
                    handleFoxskillTabClick();
                  } else if ((tab as any).isDynamic) {
                    onTabChange(tab.id);
                    setSelectedCategory((tab as any).data);
                    setIsFAQModalOpen(true);
                    // Do NOT call onTabClick to avoid opening the parent's generic modal
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
          {tabs.length > 2 && !isWebview && (
            <>
              {showLeftArrow && (
                <div className="nav-arrow-container left">
                  <button
                    className="nav-arrow-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      scroll("left");
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M12.5 15L7.5 10L12.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {/* <div className="arrow-gradient-overlay left"></div> */}
                </div>
              )}
              {showRightArrow && (
                <div className="nav-arrow-container right">
                  {/* <div className="arrow-gradient-overlay right"></div> */}
                  <button
                    className="nav-arrow-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      scroll("right");
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <FAQModal
        category={selectedCategory}
        isOpen={isFAQModalOpen}
        onClose={() => {
          setIsFAQModalOpen(false);
          onTabChange("");
        }}
        token={token}
      />
    </>
  );
};

export default TabBar;
