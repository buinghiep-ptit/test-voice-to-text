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
import { useEffect, useState } from "react";

interface ChatMessageProps {
  chat: IHistory;
  onTypeProgress?: () => void;
  botInfo?: {
    name: string;
    avatar: string;
  };
}

const ChatMessage = ({ chat, onTypeProgress, botInfo }: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const isToday = moment(chat.dateCreated || new Date()).isSame(
    moment(),
    "day"
  );

  useEffect(() => {
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

  const MessageWrapper =
    chat.role === "Ai" && chat.isNewChat ? motion.div : "div";

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
          src={botInfo?.avatar}
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
            }}
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
                {preprocessLaTeX(replaceLiteralNewlines(displayedText))}
              </Markdown>
            )}
          </div>
        )}
      </div>
    </MessageWrapper>
  );
};

export default ChatMessage;
