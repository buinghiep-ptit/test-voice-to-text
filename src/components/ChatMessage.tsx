import { motion } from "framer-motion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { preprocessLaTeX } from "../utils/latex";
// import "katex/dist/katex.min.css";
import "./message.css";
import moment from "moment";
import DotLoading from "./DotLoading";
import { IHistory } from "../pages/Chat";
import { useEffect, useState } from "react";

interface ChatMessageProps {
  chat: IHistory;
  onTypeProgress?: () => void;
}

const ChatMessage = ({ chat, onTypeProgress }: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState("");

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
          src="/assets/images/chang-avatar.jpg"
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
            <span style={{ fontWeight: 600 }}>Chang </span>{" "}
            <span style={{ color: "#6B7280" }}>
              {chat?.dateCreated &&
                moment(chat?.dateCreated).format("DD/MM/YYYY") + " lúc "}
              {moment(chat?.dateCreated || new Date()).format("HH:mm")}
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
              >
                {preprocessLaTeX(chat.content || "")}
              </Markdown>
            ) : (
              <Markdown
                remarkPlugins={[
                  remarkGfm,
                  [remarkMath, { singleDollarTextMath: false }],
                ]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
              >
                {preprocessLaTeX(displayedText)}
              </Markdown>
            )}
          </div>
        )}
      </div>
    </MessageWrapper>
  );
};

export default ChatMessage;
