/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import "./App.css";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import Typewriter from "./components/TypeWriter";
import DotLoading from "./components/DotLoading";

export interface IHistory {
  role?: string;
  content?: string;
  isError?: boolean;
  dateCreated?: string;
}

function App() {
  const [chatHistory, setChatHistory] = useState<IHistory[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:3000") return;

      if (event.data.action === "init") {
        const dataToken = event.data.token;
        authUser(dataToken);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

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
    <div
      className={`container ${showChatbot ? "show-chatbot" : ""}`}
      style={{ pointerEvents: "auto" }}
    >
      <div className="chat-toggle">
        <div
          className="greeting"
          onMouseDown={() => setShowChatbot((prev) => !prev)}
        >
          <Typewriter text="Chang luôn ở đây để giúp bạn bạn nhé" speed={80} />
        </div>
        <img
          src="/assets/images/chatbot-icon.svg"
          alt="ic"
          className="w-20 h-20 cursor-pointer"
          onClick={() => setShowChatbot((prev) => !prev)}
        />
      </div>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            {/* <img
              src="/assets/images/chatbot-icon.svg"
              alt="ic"
              className="w-6 h-6"
            /> */}
            <h2 className="logo-text">Iam Chang</h2>
          </div>

          <button
            className="btn-icon cursor-pointer"
            onClick={() => setShowChatbot((prev) => !prev)}
          >
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
                src="/assets/images/chatbot-icon.svg"
                alt="ic"
                className="w-8 h-8 rounded-full bg-amber-50"
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
    </div>
  );
}

export default App;
