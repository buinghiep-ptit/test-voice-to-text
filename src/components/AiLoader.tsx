// SimpleStarLoading.tsx – Ngôi sao với gradient động + vòng tròn xanh tím
const SimpleStarLoading = ({ size = 80 }: { size?: number }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Vòng loading quay bao ngoài với gradient xanh tím */}
      <svg
        className="absolute inset-0 animate-spin"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="#e0e7ff"
          strokeWidth="6"
          opacity="0.25"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="url(#grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="85 200"
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ngôi sao 4 cánh với gradient động */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="absolute inset-0 animate-star-wobble"
      >
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor="#60a5fa"
              className="animate-color-shift-1"
            >
              <animate
                attributeName="stop-color"
                values="#60a5fa; #c084fc; #818cf8; #60a5fa"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="50%"
              stopColor="#a78bfa"
              className="animate-color-shift-2"
            >
              <animate
                attributeName="stop-color"
                values="#a78bfa; #818cf8; #c084fc; #a78bfa"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="100%"
              stopColor="#c7d2fe"
              className="animate-color-shift-3"
            >
              <animate
                attributeName="stop-color"
                values="#c7d2fe; #ddd6fe; #e0e7ff; #c7d2fe"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        {/* Ngôi sao 4 cánh mảnh */}
        <path
          d="M50 20 L58 38 L75 50 L58 62 L50 80 L42 62 L25 50 L42 38 Z"
          fill="url(#starGrad)"
          stroke="#fff"
          strokeWidth="2"
          opacity="0.95"
        />
      </svg>

      <style>{`
        @keyframes star-wobble {
          0% {
            transform: rotate(0deg);
          }
          15% {
            transform: rotate(90deg);
          }
          30% {
            transform: rotate(90deg);
          }
          45% {
            transform: rotate(180deg);
          }
          55% {
            transform: rotate(180deg);
          }
          70% {
            transform: rotate(270deg);
          }
          85% {
            transform: rotate(270deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-star-wobble {
          animation: star-wobble 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default SimpleStarLoading;
