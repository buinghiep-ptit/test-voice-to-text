import Markdown from "react-markdown";
import { IHistory } from "../App";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { preprocessLaTeX } from "../utils/latex";
// import "katex/dist/katex.min.css";
import "./message.css";
import moment from "moment";
import DotLoading from "./DotLoading";

const ChatMessage = ({ chat }: { chat: IHistory }) => {
  return (
    <div
      className={`item-message ${chat.role === "Ai" ? "bot" : "user"}-message ${
        chat.isError ? "error" : ""
      }`}
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
            <Markdown
              remarkPlugins={[
                remarkGfm,
                [remarkMath, { singleDollarTextMath: false }],
              ]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
            >
              {preprocessLaTeX(chat.content!)}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
