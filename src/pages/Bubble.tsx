import { useEffect, useState } from "react";
import Typewriter from "../components/TypeWriter";

function Bubble() {
  const [isShowSayHi, setIsShowSwayHi] = useState(true);

  const openChat = () => {
    window.parent.postMessage(
      {
        type: "TOGGLE_CHAT",
        data: "Data from bubble-frame",
        target: "chat-frame",
        isOpen: true,
      },
      "*", // http://localhost:3000
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setIsShowSwayHi(false);
    }, 5000);
  }, []);

  return (
    <div className="chat-toggle bg-transparent flex items-start justify-end overflow-hidden gap-1 cursor-pointer">
      {isShowSayHi && (
        <div
          className="greeting bg-[#0F62FE] py-2! px-3! rounded-3xl rounded-br-none"
          onMouseDown={openChat}
        >
          <Typewriter text="Chang luôn ở đây để giúp bạn bạn nhé" speed={50} />
        </div>
      )}
      <img
        src="/ai-agent/sdk/assets/images/bot-icon-blue-unscreen.gif"
        alt="ic"
        className="w-24 h-24 cursor-pointer object-contain"
        onClick={openChat}
      />
    </div>
  );
}

export default Bubble;
