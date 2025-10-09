/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { preprocessLaTeX } from "../utils/latex";
import "katex/dist/katex.min.css";
import "./message.css";
import moment from "moment";
import DotLoading from "./DotLoading";
import { IHistory } from "../pages/Chat";
import React, { useEffect, useState, useRef } from "react";

interface ChatMessageProps {
  chat: IHistory;
  onTypeProgress?: () => void;
  isStream?: boolean;
  botInfo?: {
    name: string;
    avatar: string;
  };
  onCopy?: (text: string) => void;
}

const ChatMessage = ({
  chat,
  onTypeProgress,
  botInfo,
  isStream,
  onCopy,
}: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const isToday = moment(chat.dateCreated || new Date()).isSame(
    moment(),
    "day"
  );

  useEffect(() => {
    if (isStream) return;
    // Reset state when chat content changes
    setDisplayedText("");

    if (
      chat.role === "Ai" &&
      chat.content &&
      chat.isNewChat &&
      chat.content !== "Thinking..."
    ) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < (chat.content?.length ?? 0)) {
          const newText = chat.content?.slice(0, index + 1);
          setDisplayedText(newText!);
          // Call progress callback
          onTypeProgress?.();

          index++;
        } else {
          clearInterval(interval);
        }
      }, 10); // Adjust typing speed here (30ms per character)

      return () => clearInterval(interval);
    } else {
      // If not AI or "Thinking...", set text immediately
      setDisplayedText(chat.content || "");
    }
  }, [chat.content, chat.isNewChat, chat.role, onTypeProgress]);

  const replaceLiteralNewlines = (content: string) => {
    return content.replace(/\n\n/g, "\n\n&nbsp;\n\n"); // Thêm khoảng trắng để Markdown nhận diện đúng
  };

  // Fallback copy function cho WebView
  const fallbackCopy = (text: string) => {
    // Tạo textarea tạm thời
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Đặt style để ẩn element nhưng vẫn có thể select
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);

    // Focus và select text
    textArea.focus();
    textArea.select();

    // Thử select cho iOS
    textArea.setSelectionRange(0, text.length);

    try {
      // Sử dụng execCommand (hoạt động tốt trên WebView)
      const successful = document.execCommand("copy");
      if (successful && typeof onCopy === "function") {
        onCopy(text);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    } finally {
      // Cleanup
      document.body.removeChild(textArea);
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;

    // Phương pháp 1: Thử clipboard API trước
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          if (typeof onCopy === "function") onCopy(text);
        })
        .catch((err) => {
          // Nếu clipboard API thất bại, sử dụng fallback
          console.log("Clipboard API failed, using fallback:", err);
          fallbackCopy(text);
        });
    } else {
      // Nếu không có clipboard API, sử dụng fallback ngay
      fallbackCopy(text);
    }
  };

  const MessageWrapper =
    chat.role === "Ai" && chat.isNewChat ? motion.div : "div";

  const longPressTimeout = useRef<number | null>(null);

  const handleLongPressStart =
    (content: string) => (e: React.TouchEvent | React.MouseEvent) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
      longPressTimeout.current = window.setTimeout(() => {
        handleCopy(content);
      }, 700);
    };

  const handleLongPressEnd = () => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
  };

  return (
    <MessageWrapper
      className={`item-message ${chat.role === "Ai" ? "bot" : "user"}-message ${
        chat.isError ? "error" : ""
      }`}
      {...(chat.role === "Ai" && chat.isNewChat
        ? {
            initial: { x: -100, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            transition: { type: "spring", stiffness: 50, damping: 10 },
          }
        : {})}
    >
      {chat.role === "Ai" && (
        <img
          src={
            botInfo?.avatar || "/ai-agent/sdk/assets/images/chang-avatar.jpg"
          }
          alt="ic"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      <div
        style={{ width: "100%" }}
        className={`${chat.role === "Ai" ? "bot" : "user"}-message`}
      >
        {chat.role == "Ai" && chat.content !== "Thinking..." && (
          <div className="time-message">
            <span style={{ fontWeight: 600 }}>{botInfo?.name}</span>{" "}
            <span style={{ color: "#6B7280" }}>
              {isToday
                ? moment(chat?.dateCreated || new Date()).format("HH:mm")
                : moment(chat?.dateCreated).format("DD/MM/YYYY") +
                  " lúc " +
                  moment(chat?.dateCreated || new Date()).format("HH:mm")}
            </span>
          </div>
        )}
        {chat.content === "Thinking..." ? (
          <DotLoading />
        ) : (
          <div
            className="message-text"
            style={{
              display: "flex",
              flexDirection: "column",
              overflowX: "auto",
              position: "relative",
            }}
            onMouseDown={handleLongPressStart(chat.content || displayedText)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={handleLongPressStart(chat.content || displayedText)}
            onTouchEnd={handleLongPressEnd}
            onContextMenu={(e) => e.preventDefault()}
          >
            {!chat.isNewChat ? (
              <Markdown
                remarkPlugins={[
                  remarkGfm,
                  [remarkMath, { singleDollarTextMath: false }],
                ]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  a: ({ node, ...props }) => {
                    const isInIframe =
                      typeof window !== "undefined" &&
                      window.self !== window.top; // Kiểm tra nếu trong iframe

                    return (
                      <a
                        {...props}
                        target={isInIframe ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 transition-all"
                      >
                        {props.children}
                      </a>
                    );
                  },
                  img: ({ node, ...props }) => {
                    // Tạo một handler để mở ảnh trong tab mới khi click
                    const handleImageClick = (src: string) => {
                      window.open(src, "_blank", "noopener,noreferrer");
                    };

                    return (
                      <img
                        {...props}
                        className="cursor-pointer max-w-full hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(props.src || "")}
                        style={{ maxWidth: "100%" }}
                        title={`Click để xem ảnh đầy đủ trong tab mới (${
                          props.alt || "Ảnh"
                        })`}
                      />
                    );
                  },
                }}
              >
                {preprocessLaTeX(replaceLiteralNewlines(chat.content || ""))}
              </Markdown>
            ) : (
              <Markdown
                remarkPlugins={[
                  remarkGfm,
                  [remarkMath, { singleDollarTextMath: false }],
                ]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  a: ({ node, ...props }) => {
                    const isInIframe =
                      typeof window !== "undefined" &&
                      window.self !== window.top; // Kiểm tra nếu trong iframe

                    return (
                      <a
                        {...props}
                        target={isInIframe ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 transition-all"
                      >
                        {props.children}
                      </a>
                    );
                  },

                  img: ({ node, ...props }) => {
                    // Tạo một handler để mở ảnh trong tab mới khi click
                    const handleImageClick = (src: string) => {
                      window.open(src, "_blank", "noopener,noreferrer");
                    };

                    return (
                      <img
                        {...props}
                        className="cursor-pointer max-w-full hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(props.src || "")}
                        style={{ maxWidth: "100%" }}
                        title={`Click để xem ảnh đầy đủ trong tab mới (${
                          props.alt || "Ảnh"
                        })`}
                      />
                    );
                  },
                }}
              >
                {preprocessLaTeX(
                  !isStream ? displayedText : chat?.content || ""
                )}
              </Markdown>
            )}
          </div>
        )}

        {/* Copy icon for bot messages */}
        {chat.role === "Ai" && chat.content !== "Thinking..." && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 2,
              marginLeft: 16,
              gap: 4,
              justifyContent: "flex-start",
            }}
          >
            <button
              type="button"
              aria-label="Sao chép"
              onClick={() => handleCopy(chat.content || displayedText)}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCopy(chat.content || displayedText);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 3,
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                marginLeft: -3,
                position: "relative",
                WebkitTapHighlightColor: "transparent", // Tắt highlight trên mobile
              }}
              title="Sao chép"
            >
              <img
                src="/ai-agent/sdk/assets/images/copy.png"
                alt="ic"
                className={`w-4 h-4 opacity-50`}
              />
            </button>
          </div>
        )}
      </div>
    </MessageWrapper>
  );
};

// Using React.memo to prevent unnecessary re-renders
const MemoizedChatMessage = React.memo(ChatMessage, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.chat.role === nextProps.chat.role &&
    prevProps.chat.content === nextProps.chat.content &&
    prevProps.chat.isError === nextProps.chat.isError &&
    prevProps.chat.isNewChat === nextProps.chat.isNewChat &&
    prevProps.botInfo?.name === nextProps.botInfo?.name &&
    prevProps.botInfo?.avatar === nextProps.botInfo?.avatar &&
    prevProps.isStream === nextProps.isStream
  );
});

export default MemoizedChatMessage;
