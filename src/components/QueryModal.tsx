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
}

const QueryModal: React.FC<QueryModalProps> = ({
  isOpen,
  onClose,
  onSendQuery,
  data,
  title,
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
    setSelectedItem(item);
    setInputValue("");

    setTimeout(() => {
      if (item.command.includes("{input}") && inputRef.current) {
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
              >
                <div className="query-title">{item.title}</div>
                {/* <div className="query-example">{item.example}</div> */}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          {selectedItem && selectedItem.command.includes("{input}") && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập số hợp đồng/số điện thoại..."
              className="query-input"
              style={{ flex: 1, marginRight: 12 }}
            />
          )}
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={
              !selectedItem ||
              (selectedItem.command.includes("{input}") && !inputValue.trim())
            }
          >
            Gửi tra cứu
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryModal;
