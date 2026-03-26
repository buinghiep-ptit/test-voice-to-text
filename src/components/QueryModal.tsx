import React, { useState, useRef, useEffect } from "react";

interface QueryItem {
  id: number;
  title: string;
  command: string;
  example: string;
}

interface QueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuery: (query: string) => void;
  data: QueryItem[];
  title: string;
  primaryColor?: string;
}

const QueryModal: React.FC<QueryModalProps> = ({
  isOpen,
  onClose,
  onSendQuery,
  data,
  title,
  primaryColor,
}) => {
  const [selectedItem, setSelectedItem] = useState<QueryItem | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // Reset selection khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setSelectedItem(null);
      setInputValue("");
    }
  }, [isOpen]);

  const handleItemClick = (item: QueryItem) => {
    const hasInputPlaceholder = item.command.includes("{input}");

    if (!hasInputPlaceholder) {
      // Nếu không cần input, submit luôn
      onSendQuery(item.command);
      setSelectedItem(null);
      setInputValue("");
      onClose();
      return;
    }

    setSelectedItem(item);
    setInputValue("");

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleSubmit = () => {
    if (!selectedItem) return;

    // Kiểm tra xem command có chứa placeholder {input} không
    const hasInputPlaceholder = selectedItem.command.includes("{input}");

    // Nếu có placeholder mà input trống thì không submit
    if (hasInputPlaceholder && !inputValue.trim()) return;

    // Tạo request text từ command và input value (nếu có)
    let query = selectedItem.command;
    if (hasInputPlaceholder) {
      query = selectedItem.command.replace(/{[^}]+}/, inputValue.trim());
    }

    onSendQuery(query);

    // Reset form
    setSelectedItem(null);
    setInputValue("");
    onClose();
  };

  const disabled =
    !selectedItem ||
    (selectedItem.command.includes("{input}") && !inputValue.trim());

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose} aria-label="Đóng">
            <svg
              width="28"
              height="28"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L14 14M14 6L6 14"
                stroke="#6c757d"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="modal-body" ref={modalBodyRef}>
          <div className="query-list">
            {data.map((item) => (
              <div
                key={item.id}
                className={`query-item ${
                  selectedItem?.id === item.id ? "selected" : ""
                }`}
                onClick={() => handleItemClick(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="query-title">{item.title}</div>
                <div className="query-item-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedItem && selectedItem.command.includes("{input}") && (
          <div className="modal-footer">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder={
                title === "Tra cứu hợp đồng" && selectedItem?.id === 11
                  ? "Nhập số CCCD/Hộ chiếu..."
                  : "Nhập số hợp đồng/số điện thoại..."
              }
              className="query-input"
              style={{ flex: 1, marginRight: 12 }}
            />
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={disabled}
              style={{ backgroundColor: disabled ? "#d1d5db" : primaryColor }}
            >
              Gửi tra cứu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryModal;
