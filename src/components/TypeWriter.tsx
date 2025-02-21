import { useState, useEffect } from "react";

type Props = {
  text: string;
  speed?: number;
  loop?: boolean;
};

const Typewriter = ({ text, speed = 100, loop = false }: Props) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (loop) {
      setTimeout(() => {
        setDisplayedText("");
        setIndex(0);
      }, 1000); // Pause before restarting
    }
  }, [index, text, speed, loop]);

  return (
    <span className="text-sm text-white whitespace-nowrap">
      {displayedText}
      {/* <span className="cursor">|</span> */}
    </span>
  );
};

export default Typewriter;
