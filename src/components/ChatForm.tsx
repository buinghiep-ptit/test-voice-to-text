import { useRef, useState, useEffect } from "react";
import { SendIcon, MicrophoneIcon } from "./Icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

type Props = {
  setChatHistory: React.Dispatch<React.SetStateAction<IHistory[]>>;
  generateBotResponse: (h: IHistory) => void;
  iconColor?: string;
  foxsteps?: boolean;
  onSubmit?: () => void;
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
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const baseTextRef = useRef<string>(""); // text gõ tay trước khi bật mic

  const [isComposing, setIsComposing] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // ─── Sync transcript → textarea realtime ─────────────────────────────────
  useEffect(() => {
    if (!listening || !inputRef.current) return;

    const combined = [baseTextRef.current, transcript]
      .filter(Boolean)
      .join(" ");

    inputRef.current.value = combined;
    adjustTextareaHeight();
  }, [transcript, listening]);

  // ─── Khi dừng mic: chốt text, KHÔNG resetTranscript ngay ─────────────────
  useEffect(() => {
    if (listening || !inputRef.current) return;

    // Chốt toàn bộ text hiện tại làm base cho lần nói tiếp
    baseTextRef.current = inputRef.current.value;
    // Reset transcript SAU KHI đã chốt xong
    resetTranscript();
  }, [listening]);

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (listening) SpeechRecognition.stopListening();

    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;

    baseTextRef.current = "";
    resetTranscript();

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = "46px";
    }

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

  // ─── Mic toggle ───────────────────────────────────────────────────────────
  const handleMicrophoneClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      // Chốt text hiện tại trước khi bật mic
      baseTextRef.current = inputRef.current?.value.trim() ?? "";
      resetTranscript();

      SpeechRecognition.startListening({
        language: "vi-VN",
        continuous: true, // không tự dừng
        interimResults: true, // hiển thị realtime
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isComposing) handleFormSubmit();
    }
  };

  const handleInputChange = () => {
    if (!listening && inputRef.current) {
      baseTextRef.current = inputRef.current.value;
    }
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = "46px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 88)}px`;
  };

  return (
    <form action="#" onSubmit={handleFormSubmit}>
      <textarea
        ref={inputRef}
        placeholder={
          foxsteps ? "Nhập câu hỏi của bạn..." : "Trò chuyện cùng mình nhé..."
        }
        className="outline-none w-full resize-none"
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        required
        style={{ caretColor: iconColor }}
      />

      {foxsteps && (
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
        <button className="btn-action" type="submit">
          <SendIcon color={iconColor} className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
