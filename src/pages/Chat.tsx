/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import ChatForm from "../components/ChatForm";
import ChatMessage from "../components/ChatMessage";
import DotLoading from "../components/DotLoading";
import TabBar from "../components/TabBar";
import QueryModal from "../components/QueryModal";
import { useSearchParams } from "react-router-dom";
import ClearHistoryDialog from "../components/ClearHistoryDialog";
import {
  customerInfoQueries,
  fptPlayQueries,
  taskQueries,
} from "../data/queryData";

export interface IHistory {
  id?: number;
  role?: string;
  content?: string;
  isError?: boolean;
  dateCreated?: string;
  isNewChat?: boolean;
  isThinking?: boolean;
  isFinal?: boolean;
  isLiked?: number; // 1 = liked, 0 = not liked
  assistantAgents?: { name: string; avatar: string }[];
  thinkingLabel?: string;
}

function Chat() {
  const [searchParams] = useSearchParams();
  const [chatHistory, setChatHistory] = useState<IHistory[]>([]);
  const [userToken, setUserToken] = useState("");
  const [botInfo, setBotInfo] = useState({
    name: "Chang",
    avatar: "/ai-agent/sdk/assets/images/chang-avatar.jpg",
  });
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef<HTMLInputElement>(null);

  const isAllowExpandBot = searchParams.get("isAllowExpandBot");
  const tenantId = searchParams.get("tenant_id");
  const isCustomBotInfo = true;
  const isStream = true; //searchParams.get("isStream");
  const isWebview = searchParams.get("isWebview");
  const isFoxskill = searchParams.get("foxskill");

  const decodeToken = tenantId ? decodeURIComponent(tenantId) : "";

  const [isMaximized, setIsMaximized] = useState(false);
  const [isShowClearHistoryDialog, setIsShowClearHistoryDialog] =
    useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(customerInfoQueries);
  const [modalTitle, setModalTitle] = useState("Tra cứu hợp đồng");
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [showBrickedToast, setShowBrickedToast] = useState(false);

  const toggleMaximize = () => {
    const newState = !isMaximized;
    setIsMaximized(newState);
    if (window.parent) {
      window.parent.postMessage(
        {
          type: newState ? "MAXIMIZE_CHAT" : "MINIMIZE_CHAT",
          data: "Data from chat-frame",
          target: "chat-frame",
        },
        "*",
      );
    }
  };

  const closeChat = () => {
    window.parent.postMessage(
      {
        type: "TOGGLE_CHAT",
        data: "Data from chat-frame",
        target: "bubble-frame",
        isOpen: false,
      },
      "*",
    );
  };

  useEffect(() => {
    window.parent.postMessage(
      {
        type: "INIT_CHAT",
        data: "Data from chat-frame",
        target: "bubble-frame",
      },
      "*",
    );
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // if (event.origin !== "http://localhost:3000") return;

      if (event.data.type === "TOGGLE_CHAT") {
        window.parent.postMessage(
          {
            type: "message",
            data: "Data from chat-frame",
            target: "bubble-frame",
          },
          "*",
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!decodeToken) return;
    authUser(decodeToken);
  }, [decodeToken]);

  const authUser = async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/authenticate/v2`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: token,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");
      setUserToken(data.accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userToken || !isCustomBotInfo) return;
    getBotInfo(userToken);
  }, [userToken, isCustomBotInfo]);

  const getBotInfo = async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/agent-info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");
      setBotInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userToken) return;
    getChatHistory(userToken);
  }, [userToken]);

  const clearChatHistory = async (userToken: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/chat-history`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");
      setChatHistory((prev) => [
        ...prev,
        {
          content: data.text,
          role: "Ai",
          id: data.msgId,
          isFinal: true,
          isNewChat: true,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getChatHistory = async (userToken: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/chat-history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      const data = await response.json();
      setLoading(false);

      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");

      setChatHistory(
        data.items.reverse().map((msg: IHistory) => ({
          ...msg,
          isNewChat: false,
          isThinking: false,
          // Với history trả về từ API, coi như là final message
          isFinal: msg.role === "Ai" ? true : msg.isFinal,
        })),
      );
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // API functions for like and brick
  const handleLike = async (messageId: number, action: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL
        }/api/sdk/message/${messageId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            action: action,
            comment: null,
          }),
        },
      );

      if (response.ok) {
        // Update the message in chat history
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isLiked: 1 } : msg,
          ),
        );
      } else {
        console.error("Like failed:", response.statusText);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleBrick = async (
    messageId: number,
    action: number,
    comment: string,
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL
        }/api/sdk/message/${messageId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            action: action,
            comment: comment,
          }),
        },
      );

      if (response.ok) {
        console.log("Brick successful");
        // You might want to show a success message or update UI
      } else {
        console.error("Brick failed:", response.statusText);
      }
    } catch (error) {
      console.error("Brick error:", error);
    }
  };

  const generateBotResponse = async (history: IHistory) => {
    const updateHistory = (text: string, isError = false) => {
      setChatHistory((prev) => [
        ...prev
          .filter(
            (msg) =>
              msg.content !== "Thinking..." &&
              msg.content !== "Đang suy nghĩ" &&
              msg.content !== "Đang trả lời" &&
              !msg.isThinking &&
              !msg.isFinal,
          )
          .map((msg) => ({
            ...msg,
            isNewChat: false,
          })),
        { role: "Ai", content: text, isError, isNewChat: true, isFinal: true },
      ]);
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        text: history.content,
      }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/chat`,
        requestOptions,
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");
      updateHistory(data.text);
    } catch (error: any) {
      updateHistory(error.message, true);
      console.log(error);
    }
  };

  const generateBotResponseSimple = async (history: IHistory) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/chat?isStream=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            text: history.content,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Something went wrong!");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      // Tạo aiMessage object duy nhất (nội bộ để lưu final)
      const aiMessage: IHistory = {
        content: "",
        role: "Ai",
        isError: false,
        isNewChat: true,
        isThinking: false,
        isFinal: false,
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const data = JSON.parse(line);

            if (data.type === "thinking") {
              // Kiểm tra nếu đã có nội dung in-progress
              if (aiMessage.content && aiMessage.content.trim() !== "") {
                // Nếu có in-progress, thêm text của thinking vào content stream với xuống dòng
                aiMessage.content += "\n\n" + (data.text || "");

                setChatHistory((prev) => {
                  if (prev.length > 0 && prev[prev.length - 1].role === "Ai") {
                    return [
                      ...prev.slice(0, -1),
                      { ...aiMessage, isThinking: false, isFinal: false },
                    ];
                  } else {
                    return [
                      ...prev.map((msg) => ({ ...msg, isNewChat: false })),
                      { ...aiMessage, isThinking: false, isFinal: false },
                    ];
                  }
                });
              } else {
                // Logic cũ: Hiển thị thinking status khi chưa có in-progress
                setChatHistory((prev) => {
                  const thinkingMsg: IHistory = {
                    role: "Ai",
                    content: `Đang hỏi ${data.name}...`,
                    isError: false,
                    isNewChat: true,
                    isThinking: true,
                    isFinal: false,
                    thinkingLabel: data.type === "thinking" ? `${data.text}` : "",
                  };

                  if (prev.length > 0 && prev[prev.length - 1].role === "Ai") {
                    return [...prev.slice(0, -1), thinkingMsg];
                  } else {
                    return [
                      ...prev.map((msg) => ({ ...msg, isNewChat: false })),
                      thinkingMsg,
                    ];
                  }
                });
              }
            } else if (data.type === "in-progress") {
              // Hiển thị nội dung stream và giữ label "Đang trả lời..." ở UI (hiển thị tại ChatMessage)
              aiMessage.content += data.text || "";

              if ((aiMessage.content || "").trim()) {
                setChatHistory((prev) => {
                  if (prev.length > 0 && prev[prev.length - 1].role === "Ai") {
                    return [
                      ...prev.slice(0, -1),
                      { ...aiMessage, isThinking: false, isFinal: false },
                    ];
                  } else {
                    return [
                      ...prev.map((msg) => ({ ...msg, isNewChat: false })),
                      { ...aiMessage, isThinking: false, isFinal: false },
                    ];
                  }
                });
              }
            } else if (data.type === "final") {
              aiMessage.content = data.text || aiMessage.content;
              aiMessage.assistantAgents = data.assistantAgents || [];

              setChatHistory((prev) => {
                if (prev.length > 0 && prev[prev.length - 1].role === "Ai") {
                  return [
                    ...prev.slice(0, -1),
                    { ...aiMessage, isThinking: false, isFinal: true },
                  ];
                } else {
                  return [
                    ...prev.map((msg) => ({ ...msg, isNewChat: false })),
                    { ...aiMessage, isThinking: false, isFinal: true },
                  ];
                }
              });

              await reader.cancel();
              return;
            }
          } catch (err) {
            console.error("Failed to parse JSON line:", line, err);
          }
        }

        buffer = "";
      }
    } catch (error: any) {
      setChatHistory((prev) => {
        // Xóa thinking nếu có
        const filtered = prev.filter(
          (msg) =>
            msg.content !== "Thinking..." &&
            msg.content !== "Đang suy nghĩ" &&
            msg.content !== "Đang trả lời" &&
            !msg.isThinking &&
            !msg.isFinal,
        );
        return [
          ...filtered.map((msg) => ({ ...msg, isNewChat: false })),
          {
            role: "Ai",
            content: error.message,
            isError: true,
            isNewChat: true,
            isFinal: true,
          },
        ];
      });
      console.error("Streaming error:", error);
    }
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      requestAnimationFrame(() => {
        chatBodyRef.current?.scrollTo({
          top: chatBodyRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  };

  const scrollToBottomDelayed = () => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleClearClick = () => {
    if (chatHistory.length === 0) return;
    setIsShowClearHistoryDialog(true);
  };

  const confirmClear = () => {
    clearChatHistory(userToken);
    setIsShowClearHistoryDialog(false);
  };

  const cancelClear = () => {
    setIsShowClearHistoryDialog(false);
  };

  const handleTabClick = (tabId: string) => {
    // Đóng modal hiện tại trước khi mở modal mới
    setIsModalOpen(false);

    let data, title;
    switch (tabId) {
      case "info":
        data = customerInfoQueries;
        title = "Tra cứu hợp đồng";
        break;
      case "service":
        data = fptPlayQueries;
        title = "Tra cứu FPT Play";
        break;
      case "task":
        data = taskQueries;
        title = "Xử lý tác vụ";
        break;
      default:
        data = customerInfoQueries;
        title = "Tra cứu hợp đồng";
    }

    // Mở modal mới sau khi đã đóng modal cũ
    setTimeout(() => {
      setModalData(data);
      setModalTitle(title);
      setIsModalOpen(true);
    }, 100);
  };

  const handleSendQuery = (query: string) => {
    // Thêm user message vào chat history (giống ChatForm)
    setChatHistory((prev) => [
      ...prev.map((h) => ({ ...h, isNewChat: false })),
      { role: "Human", content: query },
    ]);

    // Scroll sau khi thêm user message
    scrollToBottomDelayed();

    // Thêm trạng thái thinking sau 600ms (giống ChatForm)
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev.map((h) => ({ ...h, isNewChat: false })),
        {
          role: "Ai",
          content: "Đang suy nghĩ",
          isThinking: true,
          isFinal: false,
        },
      ]);

      // Scroll sau khi thêm thinking message
      scrollToBottomDelayed();

      // Generate bot response
      const userMessage = { role: "Human", content: query };
      if (isStream) {
        generateBotResponseSimple(userMessage);
      } else {
        generateBotResponse(userMessage);
      }
    }, 600);
  };

  const handleMessageCopy = () => {
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 3000);
  };

  const handleMessageBricked = () => {
    setShowBrickedToast(true);
    setTimeout(() => setShowBrickedToast(false), 3000);
  };

  return (
    <div className="chatbot-popup">
      {!isWebview && (
        <div className="chat-header">
          <div className="header-info">
            <h2 className="logo-text">{botInfo?.name || "Chang"}</h2>
          </div>

          <div className="flex items-center gap-2">
            {isAllowExpandBot && (
              <button
                className="btn-icon cursor-pointer"
                onClick={toggleMaximize}
              >
                <img
                  src={
                    !isMaximized
                      ? "/ai-agent/sdk/assets/images/arrows-big.png"
                      : "/ai-agent/sdk/assets/images/arrows-small.png"
                  }
                  alt={!isMaximized ? "Maximize" : "Minimize"}
                  className="w-6"
                  style={{
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </button>
            )}

            <button className="btn-icon cursor-pointer" onClick={closeChat}>
              <img
                src="/ai-agent/sdk/assets/images/minimize_white.svg"
                alt="ic"
                className="w-6"
              />
            </button>
          </div>
        </div>
      )}
      {/* Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTabClick={handleTabClick}
        foxskill={isFoxskill}
      />

      {/* Query Modal */}
      <QueryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendQuery={handleSendQuery}
        data={modalData}
        title={modalTitle}
      />

      {loading && (
        <div className="backdrop-chat">
          <DotLoading />
        </div>
      )}

      {showCopiedToast && (
        <div
          style={{
            position: "absolute",
            zIndex: 200,
            left: "50%",
            top: "36%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.74)",
            color: "#fff",
            borderRadius: 6,
            padding: "2px 10px",
            fontSize: 13,
            fontWeight: 500,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          Đã sao chép
        </div>
      )}

      {showBrickedToast && (
        <div
          style={{
            position: "absolute",
            zIndex: 200,
            left: "50%",
            top: "42%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.74)",
            color: "#fff",
            borderRadius: 6,
            padding: "2px 10px",
            fontSize: 13,
            fontWeight: 500,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          Cảm ơn đã góp gạch xây nhà!
        </div>
      )}

      <div ref={chatBodyRef} className="chat-body">
        {!chatHistory.length && !loading && (
          <div className="item-message bot-message">
            <img
              src={
                botInfo?.avatar ||
                "/ai-agent/sdk/assets/images/chang-avatar.jpg"
              }
              alt="ic"
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="message-text">
              Hi 😄,
              <br />
              {botInfo?.name} có thể giúp gì cho bạn?
            </p>
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <ChatMessage
            botInfo={botInfo}
            key={index}
            chat={chat}
            onTypeProgress={scrollToBottom}
            isStream={!!isStream}
            onCopy={handleMessageCopy}
            onLike={handleLike}
            onBrick={handleBrick}
            onBricked={handleMessageBricked}
          />
        ))}
      </div>

      <div className="chat-footer">
        <ChatForm
          setChatHistory={setChatHistory}
          generateBotResponse={
            isStream ? generateBotResponseSimple : generateBotResponse
          }
        />
        <button onClick={handleClearClick} className="clear-btn cursor-pointer">
          <img
            src="/ai-agent/sdk/assets/images/clear-icon.png"
            alt="ic"
            className={`w-6 ${chatHistory.length > 0 ? "" : "cursor-not-allowed"
              }`}
          />
        </button>
      </div>

      {isShowClearHistoryDialog && (
        <ClearHistoryDialog
          cancelClear={cancelClear}
          confirmClear={confirmClear}
        />
      )}
    </div>
  );
}

export default Chat;
