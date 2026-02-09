/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import "./FAQModal.css";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
// Assuming preprocessLaTeX exists in utils/latex based on ChatMessage.tsx
import { preprocessLaTeX } from "../utils/latex";

export interface FAQCategory {
  id: number;
  name: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQResponse {
  data: FAQ[];
  nextLastId: number | string | null;
  hasNext: boolean;
}

interface FAQModalProps {
  category: FAQCategory | null;
  isOpen: boolean;
  onClose: () => void;
  token?: string;
}

const FAQModal: React.FC<FAQModalProps> = ({
  category,
  isOpen,
  onClose,
  token,
}) => {
  // Removed 'view' state as we rely on selectedQuestion for detail view visibility
  const [questions, setQuestions] = useState<FAQ[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [nextLastId, setNextLastId] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset state when category changes or modal opens
  useEffect(() => {
    if (isOpen && category) {
      setQuestions([]);
      setSelectedQuestion(null);
      setNextLastId(null);
      setHasNext(false);
      setSearchQuery("");
      fetchFAQs(null, "");
    }
  }, [isOpen, category]);

  const fetchFAQs = async (
    cursor: number | string | null,
    search: string,
    append: boolean = false,
  ) => {
    if (!category) return;
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_APP_URL || "";
      let url = `${baseUrl}/api/sdk/faq-category/${category.id}/faqs?limit=20`;
      if (cursor) {
        url += `&lastId=${cursor}`;
      }
      if (search) {
        url += `&keyword=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            token ||
            "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhZ2VudF91c2VyX2lkX2tleSI6MTQ3LCJhdXRoIjoic3VwZXJfYWRtaW4iLCJlbWFpbCI6InN0YWdfaG9hbmdudjEzNEBmcHQuY29tIiwib3JnYW5pemF0aW9uIjoiRlRFTC9GVEVMSU1VL0RTQy9EU0NSQS8iLCJpYXQiOjE3NzA1NDg1MjYsImV4cCI6MTc3MDU5MTcyNn0.x9JVhJetOh_XVGnFztsVeSYIzvsyZ1XUgrJhIX0yVDj6KDJbExX2hJhT5g0BOAutqteYcD-bUnbPExvF2V0QKg"
          }`,
        },
      });
      const data: FAQResponse = await response.json();

      if (append) {
        setQuestions((prev) => [...prev, ...data.data]);
      } else {
        setQuestions(data.data);
      }
      setNextLastId(data.nextLastId);
      setHasNext(data.hasNext);
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      // If we have a query, search.
      // If query is empty, we reload initial list (unless it's the very first load which is handled by other useEffect)
      // But to be safe and simple: if query changed, fetch.
      // We check if questions is empty to avoid double-fetching on open (if that's a concern),
      // but debounce 500ms usually avoids conflict with the initial load effect if typed quickly.
      // However, initial load effect runs immediately.
      // Let's just fetch if searchQuery changed.
      if (searchQuery.trim() || questions.length > 0) {
        fetchFAQs(null, searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (hasNext && nextLastId) {
      fetchFAQs(nextLastId, searchQuery, true);
    }
  };

  const handleQuestionClick = (faq: FAQ) => {
    setSelectedQuestion(faq);
  };

  const handleCloseDetail = () => {
    setSelectedQuestion(null);
  };

  if (!isOpen || !category) return null;

  return (
    <div className="faq-modal-overlay" onClick={onClose}>
      <div className="faq-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* List View - Always rendered */}
        <div className="faq-modal-header">
          <div className="faq-modal-title">{category.name}</div>
          <button className="faq-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="faq-search-container">
          <input
            type="text"
            className="faq-search-input"
            placeholder="Tìm kiếm câu hỏi hoặc từ khóa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="faq-list">
          {questions.map((faq) => (
            <div
              key={faq.id}
              className="faq-item"
              onClick={() => handleQuestionClick(faq)}
            >
              <div className="faq-item-icon">🔥</div>
              <div className="faq-item-text">{faq.question}</div>
              <div className="faq-item-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}

          {loading && <div className="faq-loading">Đang tải...</div>}

          {!loading && hasNext && (
            <button className="faq-load-more" onClick={handleLoadMore}>
              Xem thêm
            </button>
          )}

          {!loading && questions.length === 0 && (
            <div className="faq-loading">Không có dữ liệu</div>
          )}
        </div>
      </div>

      {/* Detail View Overlay - MOVED OUTSIDE CONTAINER */}
      {selectedQuestion && (
        <>
          <div
            className="faq-detail-backdrop"
            onClick={(e) => {
              e.stopPropagation();
              handleCloseDetail();
            }}
          ></div>
          <div
            className="faq-detail-overlay-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="faq-modal-header">
              <button className="faq-back-btn" onClick={handleCloseDetail}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5"
                    stroke="#374151"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 19L5 12L12 5"
                    stroke="#374151"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="faq-modal-title">Chi tiết câu hỏi</div>
              <button className="faq-close-btn" onClick={handleCloseDetail}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="faq-detail-content">
              <div className="faq-detail-title">
                {selectedQuestion.question}
              </div>
              <div className="markdown-content">
                <Markdown
                  remarkPlugins={[
                    remarkGfm,
                    [remarkMath, { singleDollarTextMath: false }],
                  ]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  components={{
                    a: ({ node, ...props }) => {
                      return (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 transition-all"
                        >
                          {props.children}
                        </a>
                      );
                    },
                    img: ({ node, ...props }) => {
                      return (
                        <img
                          {...props}
                          className="cursor-pointer max-w-full hover:opacity-90 transition-opacity"
                          style={{ maxWidth: "100%" }}
                        />
                      );
                    },
                  }}
                >
                  {preprocessLaTeX(selectedQuestion.answer || "")}
                </Markdown>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FAQModal;
