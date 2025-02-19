import React, { useState, useRef } from "react";

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Trình duyệt của bạn không hỗ trợ Web Speech API!");
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Không ghi liên tục
      recognitionRef.current.interimResults = true; // Hiển thị kết quả tạm thời
      recognitionRef.current.lang = "vi-VN"; // Hỗ trợ tiếng Việt

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Lỗi nhận diện giọng nói:", event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setText(""); // Xóa nội dung cũ trước khi bắt đầu mới
      recognitionRef.current.start();
    }

    setIsListening(!isListening);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={handleToggleListening}
        style={{ fontSize: "18px", padding: "10px" }}
      >
        {isListening ? "🛑 Dừng lại" : "🎙️ Bắt đầu nói"}
      </button>
      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        <strong>Kết quả:</strong> {text || "Chưa có nội dung"}
      </p>
    </div>
  );
};

export default SpeechToText;
