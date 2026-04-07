/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { SendIcon, MicrophoneIcon } from "./Icons";

type Props = {
  setChatHistory: React.Dispatch<React.SetStateAction<IHistory[]>>;
  generateBotResponse: (h: IHistory) => void;
  iconColor?: string;
  foxsteps?: boolean;
  isVoiceChat?: boolean;
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
  // isVoiceChat,
  onSubmit,
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const [isComposing, setIsComposing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = "46px";
    }

    setChatHistory((history: IHistory[]) => [
      ...[...history.map((h) => ({ ...h, isNewChat: false }))],
      { role: "Human", content: userMessage },
    ]);

    setTimeout(() => {
      setChatHistory((history: IHistory[]) => [
        ...[...history.map((h) => ({ ...h, isNewChat: false }))],
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

    // Notify parent that form was submitted
    onSubmit?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isComposing) {
        handleFormSubmit();
      }
    }
  };

  const handleInputChange = () => {
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "46px";
      const maxHeight = 88;
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  };

  useEffect(() => {
    // Initialize Speech Recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "vi-VN";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (inputRef.current) {
          const currentValue = inputRef.current.value;
          inputRef.current.value = currentValue
            ? `${currentValue} ${transcript}`
            : transcript;
          adjustTextareaHeight();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleMicrophoneClick = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  return (
    <>
      <form action="#" className="" onSubmit={handleFormSubmit}>
        <textarea
          ref={inputRef}
          placeholder={
            foxsteps ? "Nhập câu hỏi của bạn..." : "Trò chuyện cùng mình nhé..."
          }
          className="outline-none w-full resize-none"
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          required
          style={{ caretColor: iconColor }}
        ></textarea>
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
            type="button"
            onClick={handleMicrophoneClick}
            style={{
              opacity: isListening ? 1 : 0.7,
              transition: "opacity 0.2s",
            }}
          >
            <MicrophoneIcon
              color={isListening ? "#ef4444" : iconColor}
              className="w-6 h-6"
            />
          </button>
          <button className="btn-action" type="submit">
            <SendIcon color={iconColor} className="w-6 h-6" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatForm;
