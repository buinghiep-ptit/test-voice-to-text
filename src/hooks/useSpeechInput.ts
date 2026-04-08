// hooks/useSpeechInput.ts
import { useRef, useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const isAndroid = () => /android/i.test(navigator.userAgent);

export const useSpeechInput = () => {
  const baseTextRef = useRef("");
  const [inputValue, setInputValue] = useState("");
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Sync transcript → inputValue realtime
  useEffect(() => {
    if (!listening) return;
    const combined = [baseTextRef.current, transcript]
      .filter(Boolean)
      .join(" ");
    setInputValue(combined);
  }, [transcript, listening]);

  // Khi mic dừng: chốt text, xử lý Android auto-restart
  useEffect(() => {
    if (listening) return;

    // Chốt text hiện tại
    const current = [baseTextRef.current, transcript]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (current) {
      baseTextRef.current = current;
      setInputValue(current);
    }

    // Android: tự restart sau khi mic tắt (continuous thực tế không hoạt động)
    if (isAndroid() && baseTextRef.current !== "__stopped__") {
      restartTimerRef.current = setTimeout(() => {
        if (baseTextRef.current === "__stopped__") return;
        resetTranscript();
        SpeechRecognition.startListening({
          language: "vi-VN",
          continuous: false,
        });
      }, 200);
    } else {
      resetTranscript();
    }
  }, [listening]);

  useEffect(() => {
    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    };
  }, []);

  const startListening = (currentText: string) => {
    baseTextRef.current = currentText.trim();
    resetTranscript();
    SpeechRecognition.startListening({
      language: "vi-VN",
      continuous: !isAndroid(), // Android dùng discontinuous + auto-restart
    });
  };

  const stopListening = () => {
    // Dùng sentinel để cancel auto-restart của Android
    const prev = baseTextRef.current;
    baseTextRef.current = "__stopped__";
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    SpeechRecognition.stopListening();
    // Restore sau 1 frame để effect chạy xong
    setTimeout(() => {
      baseTextRef.current = prev;
    }, 300);
  };

  const reset = () => {
    baseTextRef.current = "";
    resetTranscript();
    setInputValue("");
  };

  return {
    inputValue,
    setInputValue: (v: string) => {
      baseTextRef.current = v;
      setInputValue(v);
    },
    listening,
    startListening,
    stopListening,
    reset,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  };
};
