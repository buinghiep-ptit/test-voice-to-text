import { useRef, useState } from "react";
import { SendIcon } from "./Icons";

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

  const [isComposing, setIsComposing] = useState(false);

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
          style={{ right: foxsteps ? "24px" : "66px" }}
        >
          <button className="btn-action" type="submit">
            <SendIcon color={iconColor} className="w-6 h-6" />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatForm;
