/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import ChatForm from "../components/ChatForm";
import ChatMessage from "../components/ChatMessage";
import DotLoading from "../components/DotLoading";
import { useSearchParams } from "react-router-dom";

export interface IHistory {
  role?: string;
  content?: string;
  isError?: boolean;
  dateCreated?: string;
}

function Chat() {
  const [searchParams] = useSearchParams();
  const [chatHistory, setChatHistory] = useState<IHistory[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef<HTMLInputElement>(null);

  const tenantId = searchParams.get("tenant_id");
  const decodeToken = tenantId ? decodeURIComponent(tenantId) : "";

  const closeChat = () => {
    window.parent.postMessage(
      {
        type: "TOGGLE_CHAT",
        data: "Data from chat-frame",
        target: "bubble-frame",
        isOpen: false,
      },
      "http://localhost:3000" // *
    );
  };

  useEffect(() => {
    window.parent.postMessage(
      {
        type: "INIT_CHAT",
        data: "Data from chat-frame",
        target: "bubble-frame",
      },
      "http://localhost:3000" // *
    );
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:3000") return;

      if (event.data.type === "TOGGLE_CHAT") {
        window.parent.postMessage(
          {
            type: "message",
            data: "Data from chat-frame",
            target: "bubble-frame",
          },
          "http://localhost:3000"
        );
        setShowChatbot(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    // const handleMessage = (event: MessageEvent) => {
    //   console.log(event.data);

    //   // if (event.origin !== "http://localhost:3000") return;

    //   if (event?.data?.action === "init") {
    //     const dataToken = event.data.token;
    //     if (dataToken) authUser(dataToken);
    //   }
    // };

    // window.addEventListener("message", handleMessage);

    // return () => {
    //   window.removeEventListener("message", handleMessage);
    // };
    if (!decodeToken) return;
    authUser(decodeToken);
  }, [decodeToken]);

  const authUser = async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_AUTH_URL}/foxskill/api/sdk/authenticate`,
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
    if (!showChatbot || !userToken) return;
    getChatHistory(userToken);
  }, [showChatbot, userToken]);

  const getChatHistory = async (userToken: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/foxpro/chat-history`,
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
    } catch (e: any) {
      setLoading(false);

      console.log("error");
    }
  };

  const generateBotResponse = async (history: IHistory) => {
    const updateHistory = (text: string, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.content !== "Thinking..."),
        { role: "Ai", content: text, isError },
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
        `${import.meta.env.VITE_API_APP_URL}/api/sdk/foxpro/chat`,
        requestOptions
      );

      const data = await response.json();
      updateHistory(data.text);
    } catch (error: any) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="chatbot-popup">
      <div className="chat-header">
        <div className="header-info">
          <h2 className="logo-text">Iam Chang</h2>
        </div>

        <button className="btn-icon cursor-pointer" onClick={closeChat}>
          <img
            src="/assets/images/minimize_white.svg"
            alt="ic"
            className="w-6"
          />
        </button>
      </div>

      {loading && (
        <div className="backdrop-chat">
          <DotLoading />
        </div>
      )}

      <div ref={chatBodyRef} className="chat-body">
        {!chatHistory.length && (
          <div className="item-message bot-message">
            <img
              src="/assets/images/chang-avatar.jpg"
              alt="ic"
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="message-text">
              Hi Nghiệp 😄
              <br />
              Chang có thể giúp gì cho Nghiệp?
            </p>
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      <div className="chat-footer">
        <ChatForm
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
        />
      </div>
    </div>
  );
}

export default Chat;
