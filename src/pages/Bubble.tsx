import Typewriter from "../components/TypeWriter";

// .chat-toggle {
//   display: flex;
//   position: fixed;
//   bottom: 24px;
//   right: 6px;
//   gap: 10px;
//   align-items: flex-start;
// }

// .chat-toggle .greeting {
//   background: rgb(32, 59, 220);
//   padding: 0.625rem 0.625rem 0.625rem 0.75rem;
//   border-radius: 30px;
//   animation: shake 1.6s ease 0s infinite normal none running;
//   cursor: pointer;
// }

function Bubble() {
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

  return (
    <div className="chat-toggle bg-transparent flex items-start justify-end overflow-hidden gap-1 cursor-pointer">
      <div
        className="greeting bg-[#0F62FE] py-2! px-3! rounded-3xl rounded-br-none"
        onMouseDown={openChat}
      >
        <Typewriter text="Chang luôn ở đây để giúp bạn bạn nhé" speed={50} />
      </div>
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
