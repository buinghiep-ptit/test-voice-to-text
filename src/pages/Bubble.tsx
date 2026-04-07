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
    }, 8000);
  }, []);

  return (
    <div className="chat-toggle bg-transparent flex items-start justify-end overflow-hidden gap-1 pointer-events-none">
      {isShowSayHi && (
        <div
          className="greeting bg-[#0F62FE] py-2! px-3! rounded-3xl rounded-br-none pointer-events-auto! cursor-pointer"
          onMouseDown={openChat}
        >
          <Typewriter text="Mình luôn ở đây để giúp bạn bạn nhé" speed={50} />
        </div>
      )}
      <img
        src="/assets/images/chang-bubble-icon.webp"
        alt="ic"
        className="w-18 h-18 object-contain pointer-events-auto! cursor-pointer "
        onClick={openChat}
      />
    </div>
  );
}

export default Bubble;
