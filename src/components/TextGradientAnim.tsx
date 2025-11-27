import React from "react";

type Props = {
  isThinking: boolean;
  content?: string;
};

const TextGradientAnim: React.FC<Props> = ({ isThinking, content }) => {
  const label = isThinking
    ? content?.startsWith("Đang hỏi")
      ? content
      : "Đang suy nghĩ..."
    : "Đang trả lời...";

  return (
    <div className="flex items-center">
      <div className="time-message">
        <span className="gradient-text">{label}</span>
      </div>

      <style>{`
        .gradient-text {
          background: linear-gradient(
            90deg,
            #6b7280 0%,
            #6b7280 20%,
            #8b5cf6 40%,
            #6366f1 50%,
            #8b5cf6 60%,
            #6b7280 80%,
            #6b7280 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
          font-weight: 500;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TextGradientAnim;
