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
  const inputSectionRef = useRef<HTMLDivElement>(null);
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
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTo({
          top: modalBodyRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
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
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <img
              src="/ai-agent/sdk/assets/images/minimize_white.svg"
              alt="close"
              className="w-6"
            />
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

          {selectedItem && selectedItem.command.includes("{input}") && (
            <div className="input-section" ref={inputSectionRef}>
              <label className="input-label">Nhập thông tin tra cứu:</label>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập thông tin cần tra cứu..."
                className="query-input"
              />
              <div className="command-preview">
                <strong>Câu lệnh:</strong> {selectedItem.command}
              </div>
              {selectedItem.example && (
                <div className="query-example" style={{ marginTop: 4 }}>
                  <strong>Ví dụ:</strong> {selectedItem.example}
                </div>
              )}
            </div>
          )}

          {selectedItem && !selectedItem.command.includes("{input}") && (
            <div className="input-section" ref={inputSectionRef}>
              <div className="command-preview">
                <strong>Câu lệnh sẽ được gửi:</strong> {selectedItem.command}
              </div>
              {selectedItem.example && (
                <div className="query-example" style={{ marginTop: 4 }}>
                  <strong>Ví dụ:</strong> {selectedItem.example}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
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
