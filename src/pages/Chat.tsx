/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import ChatForm from "../components/ChatForm";
import ChatMessage from "../components/ChatMessage";
import DotLoading from "../components/DotLoading";
import { useSearchParams } from "react-router-dom";
import ClearHistoryDialog from "../components/ClearHistoryDialog";

export interface IHistory {
  role?: string;
  content?: string;
  isError?: boolean;
  dateCreated?: string;
  isNewChat?: boolean;
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
  const isCustomBotInfo = searchParams.get("isCustomBotInfo");
  const isStream = searchParams.get("isStream");
  const decodeToken = tenantId ? decodeURIComponent(tenantId) : "";

  const [isMaximized, setIsMaximized] = useState(false);
  const [isShowClearHistoryDialog, setIsShowClearHistoryDialog] =
    useState(false);

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
        "*"
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
      "*"
    );
  };

  useEffect(() => {
    window.parent.postMessage(
      {
        type: "INIT_CHAT",
        data: "Data from chat-frame",
        target: "bubble-frame",
      },
      "*"
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
          "*"
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
        }
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
        }
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
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");
      setChatHistory([]);
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
        }
      );
      const data = await response.json();
      setLoading(false);

      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");

      setChatHistory(data.items.reverse());
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const generateBotResponse = async (history: IHistory) => {
    const updateHistory = (text: string, isError = false) => {
      setChatHistory((prev) => [
        ...prev
          .filter((msg) => msg.content !== "Thinking...")
          .map((msg) => ({
            ...msg,
            isNewChat: false,
          })),
        { role: "Ai", content: text, isError, isNewChat: true },
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
        requestOptions
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

  const generateBotResponseWithStream = async (history: IHistory) => {
    let isStreamingActive = false;
    let hasRealContent = false;

    const updateHistory = (text: string, isError = false) => {
      setChatHistory((prev) => {
        const filteredHistory = prev
          .filter((msg) => msg.content !== "Thinking...")
          .map((msg) => ({
            ...msg,
            isNewChat: false,
          }));

        if (isStreamingActive && hasRealContent) {
          // Tìm và cập nhật message AI cuối cùng
          const lastIndex = filteredHistory.length - 1;
          if (lastIndex >= 0 && filteredHistory[lastIndex].role === "Ai") {
            const updatedHistory = [...filteredHistory];
            updatedHistory[lastIndex] = {
              ...updatedHistory[lastIndex],
              content: text,
              isError,
            };
            return updatedHistory;
          }
        }

        // Tạo message AI mới
        return [
          ...filteredHistory,
          { role: "Ai", content: text, isError, isNewChat: true },
        ];
      });
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
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/chat?isStream=true`,
        requestOptions
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
      let accumulatedText = "";

      // Hiển thị "Thinking..." ngay từ đầu
      updateHistory("Thinking...");

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Xử lý multiple JSON objects trong một chunk
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === "in-progress") {
              // Bỏ qua nếu text rỗng nhưng vẫn giữ "Thinking..."
              if (data.text === "") {
                continue;
              }

              // Khi có text thực sự đầu tiên, chuyển sang chế độ streaming
              if (!hasRealContent) {
                hasRealContent = true;
                isStreamingActive = true;
                // Thay thế "Thinking..." bằng text thực sự
                updateHistory("");
              }

              // Cập nhật text tích lũy
              accumulatedText += data.text;
              updateHistory(accumulatedText);
            } else if (data.type === "final") {
              // Nếu chưa có real content, tạo message mới
              if (!hasRealContent) {
                hasRealContent = true;
                updateHistory(data.text);
              } else {
                // Cập nhật text cuối cùng
                updateHistory(data.text);
              }
              accumulatedText = data.text;
            }
          } catch (parseError) {
            // Bỏ qua các chunk không phải JSON hợp lệ
            console.warn("Failed to parse chunk:", line);
          }
        }
      }
    } catch (error: any) {
      updateHistory(error.message, true);
      console.error("Streaming error:", error);
    } finally {
      // Reset streaming flag
      isStreamingActive = false;

      // Đảm bảo message cuối cùng không còn trạng thái streaming
      setChatHistory((prev) =>
        prev.map((msg) => ({
          ...msg,
          isNewChat: false,
        }))
      );
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

  return (
    <div className="chatbot-popup">
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

      {loading && (
        <div className="backdrop-chat">
          <DotLoading />
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
          />
        ))}
      </div>

      <div className="chat-footer">
        <ChatForm
          setChatHistory={setChatHistory}
          generateBotResponse={
            isStream ? generateBotResponseWithStream : generateBotResponse
          }
        />
        <button onClick={handleClearClick} className="clear-btn cursor-pointer">
          <img
            src="/ai-agent/sdk/assets/images/clear-icon.png"
            alt="ic"
            className={`w-6 ${
              chatHistory.length > 0 ? "" : "cursor-not-allowed"
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
