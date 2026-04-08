import { useRef, useState } from "react";
import { useSpeechInput } from "../hooks/useSpeechInput";
import { MicrophoneIcon, SendIcon } from "./Icons";

type Props = {
  setChatHistory: React.Dispatch<React.SetStateAction<IHistory[]>>;
  generateBotResponse: (h: IHistory) => void;
  iconColor?: string;
  foxsteps?: boolean;
  onSubmit?: () => void;
  isVoiceChat?: boolean;
};

export interface IHistory {
  role?: string;
  content?: string;
  isError?: boolean;
  dateCreated?: string;
  isNewChat?: boolean;
  isThinking?: boolean;
  isFinal?: boolean;
}

const ChatForm = ({
  setChatHistory,
  generateBotResponse,
  iconColor,
  foxsteps,
  onSubmit,
  isVoiceChat,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  const {
    inputValue,
    setInputValue,
    listening,
    startListening,
    stopListening,
    reset,
    browserSupportsSpeechRecognition,
  } = useSpeechInput();

  const hasText = inputValue.trim().length > 0;

  const handleMicrophoneClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói");
      return;
    }
    if (listening) {
      stopListening();
    } else {
      startListening(inputValue);
    }
  };

  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (listening) stopListening();

    const userMessage = inputValue.trim();
    if (!userMessage) return;

    reset();

    setChatHistory((history) => [
      ...history.map((h) => ({ ...h, isNewChat: false })),
      { role: "Human", content: userMessage },
    ]);

    setTimeout(() => {
      setChatHistory((history) => [
        ...history.map((h) => ({ ...h, isNewChat: false })),
        {
          role: "Ai",
          content: "Đang suy nghĩ",
          isThinking: true,
          isNewChat: true,
          isFinal: false,
        },
      ]);
      generateBotResponse({ role: "Human", content: userMessage });
    }, 600);

    onSubmit?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isComposing) handleFormSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "46px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 88)}px`;
  };

  return (
    <form action="#" onSubmit={handleFormSubmit}>
      <textarea
        ref={textareaRef}
        value={inputValue}
        placeholder={
          foxsteps ? "Nhập câu hỏi của bạn..." : "Trò chuyện cùng mình nhé..."
        }
        className="outline-none w-full resize-none"
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          if (!listening) {
            setInputValue(e.target.value);
            adjustTextareaHeight();
          }
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        required
        style={{ caretColor: iconColor }}
      />

      {isVoiceChat && (
        <button
          className="btn-action mic-btn"
          type="button"
          onClick={handleMicrophoneClick}
          style={{
            position: "absolute",
            bottom: "18px",
            right: foxsteps ? "58px" : "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            borderRadius: "0.5rem",
            cursor: "pointer",
            opacity: listening ? 1 : 0.7,
            transition: "opacity 0.2s",
          }}
        >
          <MicrophoneIcon
            color={listening ? "#ef4444" : iconColor}
            className="w-6 h-6"
          />
        </button>
      )}
      <div
        className="list-btns"
        style={{
          right: foxsteps ? "24px" : "66px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <button
          className="btn-action"
          type="submit"
          disabled={!hasText}
          style={{
            opacity: hasText ? 1 : 0.4,
            cursor: hasText ? "pointer" : "not-allowed",
            transition: "opacity 0.2s",
          }}
        >
          <SendIcon color={iconColor} className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
