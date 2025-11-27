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
import MessageActions from "./MessageActions";
import { IHistory } from "../pages/Chat";
import React, { useEffect, useState } from "react";
import SimpleStarLoading from "./AiLoader";
import TextGradientAnim from "./TextGradientAnim";

interface ChatMessageProps {
  chat: IHistory;
  onTypeProgress?: () => void;
  isStream?: boolean;
  botInfo?: {
    name: string;
    avatar: string;
  };
  onCopy?: (text: string) => void;
  onLike?: (messageId: number, action: number) => void;
  onBrick?: (messageId: number, action: number, comment: string) => void;
  onBricked?: () => void;
}

const ChatMessage = ({
  chat,
  onTypeProgress,
  botInfo,
  isStream,
  onCopy,
  onLike,
  onBrick,
  onBricked,
}: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showSources, setShowSources] = useState(false);
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
  }, [chat.content, chat.isNewChat, chat.role, onTypeProgress, isStream]);

  // Removed unused helper replaceLiteralNewlines

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
      {chat.role === "Ai" &&
        (!chat.isFinal ? (
          <SimpleStarLoading size={32} />
        ) : (
          <img
            src={
              botInfo?.avatar || "/ai-agent/sdk/assets/images/chang-avatar.jpg"
            }
            alt="ic"
            className="w-8 h-8 rounded-full object-cover"
          />
        ))}

      <div
        style={{ width: "100%" }}
        className={`${chat.role === "Ai" ? "bot" : "user"}-message`}
      >
        {chat.role == "Ai" && chat.isFinal && (
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
        {chat.role == "Ai" && !chat.isFinal && (
          <TextGradientAnim
            isThinking={!!chat.isThinking}
            content={chat.content}
          />
        )}
        <div
          className={`message-text ${chat.isThinking ? "!hidden" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            overflowX: "auto",
            position: "relative",
          }}
        >
          {/* Hide body text during thinking to avoid duplicate labels with header */}
          {!(chat.role === "Ai" && chat.isThinking) && (
            <Markdown
              remarkPlugins={[
                remarkGfm,
                [remarkMath, { singleDollarTextMath: false }],
              ]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={{
                a: ({ node, ...props }) => {
                  const isInIframe =
                    typeof window !== "undefined" && window.self !== window.top; // Kiểm tra nếu trong iframe

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
              {preprocessLaTeX(!isStream ? displayedText : chat?.content || "")}
            </Markdown>
          )}
        </div>

        {chat.role === "Ai" && chat.isFinal && (
          <div className="flex items-center justify-between !mt-1.5">
            <MessageActions
              content={chat.content || displayedText}
              messageId={chat.id || 0}
              isLiked={chat.isLiked || 0}
              onCopy={onCopy || (() => {})}
              onLike={onLike}
              onBrick={onBrick}
              onBricked={onBricked}
            />
            {Array.isArray(chat.assistantAgents) &&
              chat.assistantAgents.length > 0 && (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setShowSources(true)}
                >
                  <div className="flex">
                    {chat.assistantAgents.slice(0, 3).map((agent, idx) => (
                      <img
                        key={`${agent.avatar}-${idx}`}
                        src={agent.avatar}
                        alt={agent.name}
                        className={`w-6 h-6 rounded-full border-2 border-white object-cover ${
                          idx > 0 ? "!-ml-2" : ""
                        }`}
                        style={{ zIndex: 30 + idx }}
                      />
                    ))}
                  </div>
                  <span style={{ color: "#6B7280", fontSize: 12 }}>
                    {chat.assistantAgents.length} nguồn
                  </span>
                </div>
              )}
          </div>
        )}

        {/* Sources Modal */}
        {chat.role === "Ai" &&
          chat.isFinal &&
          Array.isArray(chat.assistantAgents) &&
          chat.assistantAgents.length > 0 &&
          showSources && (
            <div
              className="modal-overlay"
              onClick={() => setShowSources(false)}
            >
              <div
                className="bg-white rounded-xl p-6! max-w-sm w-full shadow-xl transform transition-all animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="modal-title font-semibold! mb-4!">
                  Nguồn tham khảo
                </h3>
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                  {chat.assistantAgents.map((agent, idx) => (
                    <div
                      key={`${agent.avatar}-${idx}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <span className="text-sm" style={{ color: "#111827" }}>
                        {agent.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-3! mt-4!">
                  <button
                    onClick={() => setShowSources(false)}
                    className="cursor-pointer px-4! py-2! rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
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
    prevProps.isStream === nextProps.isStream &&
    prevProps.chat.isThinking === nextProps.chat.isThinking &&
    prevProps.chat.isFinal === nextProps.chat.isFinal
  );
});

export default MemoizedChatMessage;
