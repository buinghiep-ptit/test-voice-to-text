import React from "react";

type Props = {
  isThinking: boolean;
  content?: string;
  isFoxsteps?: boolean;
};

const TextGradientAnim: React.FC<Props> = ({
  isThinking,
  content,
  isFoxsteps,
}) => {
  const label = isThinking
    ? content && content.trim().length > 0
      ? content
      : "Đang suy nghĩ..."
    : "Đang trả lời...";

  const themeColors = isFoxsteps
    ? `
            #9ca3af 0%,
            #9ca3af 20%,
            #F4811F 40%,
            #fb923c 50%,
            #F4811F 60%,
            #9ca3af 80%,
            #9ca3af 100%
          `
    : `
            #6b7280 0%,
            #6b7280 20%,
            #8b5cf6 40%,
            #6366f1 50%,
            #8b5cf6 60%,
            #6b7280 80%,
            #6b7280 100%
          `;

  return (
    <div className="flex items-center">
      <div className="time-message">
        <span className="gradient-text">{label}</span>
      </div>

      <style>{`
        .gradient-text {
          background: linear-gradient(
            90deg,
            ${themeColors}
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
