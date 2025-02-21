import { useRef } from "react";

type Props = {
  setChatHistory: React.Dispatch<React.SetStateAction<IHistory[]>>;
  generateBotResponse: (h: IHistory) => void;
};

export interface IHistory {
  role?: string;
  content?: string;
  isError?: boolean;
  dateCreated?: string;
}

const ChatForm = ({ setChatHistory, generateBotResponse }: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = "46px";
    }

    setChatHistory((history: IHistory[]) => [
      ...history,
      { role: "Human", content: userMessage },
    ]);

    setTimeout(() => {
      setChatHistory((history: IHistory[]) => [
        ...history,
        { role: "Ai", content: "Thinking..." },
      ]);

      generateBotResponse({ role: "Human", content: userMessage });
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
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
          placeholder="Enter your message..."
          className="outline-none w-full resize-none"
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          required
        ></textarea>
        <div className="list-btns">
          <button className="btn-action" type="submit">
            <img
              src="/assets/images/send-icon.svg"
              alt="ic"
              className="w-6 h-6"
            />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatForm;
