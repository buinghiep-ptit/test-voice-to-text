import React from "react";

interface MessageActionsProps {
  content: string;
  messageId: number;
  isLiked: number; // 1 = liked, 0 = not liked
  onCopy: (text: string) => void;
  onLike?: (messageId: number, action: number) => void;
  onBrick?: (messageId: number, action: number, comment: string) => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  messageId,
  isLiked,
  onCopy,
  onLike,
  onBrick,
}) => {
  const [isLikedState, setIsLikedState] = React.useState(isLiked);
  const [showBrickModal, setShowBrickModal] = React.useState(false);
  const [brickComment, setBrickComment] = React.useState("");

  const handleLike = () => {
    if (isLikedState === 1) return; // Đã like rồi thì không cho like nữa

    if (typeof onLike === "function") {
      onLike(messageId, 1); // action = 1 for like
      setIsLikedState(1);
    }
  };

  const handleBrick = () => {
    setShowBrickModal(true);
  };

  const handleBrickSubmit = () => {
    if (brickComment.trim().length < 1 || brickComment.trim().length > 2000) {
      alert("Comment phải từ 1-2000 ký tự");
      return;
    }

    if (typeof onBrick === "function") {
      onBrick(messageId, 2, brickComment.trim()); // action = 2 for brick
      setShowBrickModal(false);
      setBrickComment("");
    }
  };
  const handleCopy = (text: string) => {
    if (!text) return;

    // Phương pháp 1: Thử clipboard API trước
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          if (typeof onCopy === "function") onCopy(text);
        })
        .catch((err) => {
          // Nếu clipboard API thất bại, sử dụng fallback
          console.log("Clipboard API failed, using fallback:", err);
          fallbackCopy(text);
        });
    } else {
      // Nếu không có clipboard API, sử dụng fallback ngay
      fallbackCopy(text);
    }
  };

  // Fallback copy function cho WebView
  const fallbackCopy = (text: string) => {
    // Tạo textarea tạm thời
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Đặt style để ẩn element nhưng vẫn có thể select
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);

    // Focus và select text
    textArea.focus();
    textArea.select();

    // Thử select cho iOS
    textArea.setSelectionRange(0, text.length);

    try {
      // Sử dụng execCommand (hoạt động tốt trên WebView)
      const successful = document.execCommand("copy");
      if (successful && typeof onCopy === "function") {
        onCopy(text);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    } finally {
      // Cleanup
      document.body.removeChild(textArea);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 6,
        marginLeft: 12,
        gap: 10,
        justifyContent: "flex-start",
      }}
    >
      {/* Copy button */}
      <button
        type="button"
        aria-label="Sao chép"
        onClick={() => handleCopy(content)}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCopy(content);
        }}
        title="Sao chép"
        className="cursor-pointer"
      >
        {/* <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6c757d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.75, transform: "scaleX(-1)" }}
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg> */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="#6c757d"
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
          style={{ opacity: 0.75 }}
        >
          <path d="M12.668 10.667C12.668 9.95614 12.668 9.46258 12.6367 9.0791C12.6137 8.79732 12.5758 8.60761 12.5244 8.46387L12.4688 8.33399C12.3148 8.03193 12.0803 7.77885 11.793 7.60254L11.666 7.53125C11.508 7.45087 11.2963 7.39395 10.9209 7.36328C10.5374 7.33197 10.0439 7.33203 9.33301 7.33203H6.5C5.78896 7.33203 5.29563 7.33195 4.91211 7.36328C4.63016 7.38632 4.44065 7.42413 4.29688 7.47559L4.16699 7.53125C3.86488 7.68518 3.61186 7.9196 3.43555 8.20703L3.36524 8.33399C3.28478 8.49198 3.22795 8.70352 3.19727 9.0791C3.16595 9.46259 3.16504 9.95611 3.16504 10.667V13.5C3.16504 14.211 3.16593 14.7044 3.19727 15.0879C3.22797 15.4636 3.28473 15.675 3.36524 15.833L3.43555 15.959C3.61186 16.2466 3.86474 16.4807 4.16699 16.6348L4.29688 16.6914C4.44063 16.7428 4.63025 16.7797 4.91211 16.8027C5.29563 16.8341 5.78896 16.835 6.5 16.835H9.33301C10.0439 16.835 10.5374 16.8341 10.9209 16.8027C11.2965 16.772 11.508 16.7152 11.666 16.6348L11.793 16.5645C12.0804 16.3881 12.3148 16.1351 12.4688 15.833L12.5244 15.7031C12.5759 15.5594 12.6137 15.3698 12.6367 15.0879C12.6681 14.7044 12.668 14.211 12.668 13.5V10.667ZM13.998 12.665C14.4528 12.6634 14.8011 12.6602 15.0879 12.6367C15.4635 12.606 15.675 12.5492 15.833 12.4688L15.959 12.3975C16.2466 12.2211 16.4808 11.9682 16.6348 11.666L16.6914 11.5361C16.7428 11.3924 16.7797 11.2026 16.8027 10.9209C16.8341 10.5374 16.835 10.0439 16.835 9.33301V6.5C16.835 5.78896 16.8341 5.29563 16.8027 4.91211C16.7797 4.63025 16.7428 4.44063 16.6914 4.29688L16.6348 4.16699C16.4807 3.86474 16.2466 3.61186 15.959 3.43555L15.833 3.36524C15.675 3.28473 15.4636 3.22797 15.0879 3.19727C14.7044 3.16593 14.211 3.16504 13.5 3.16504H10.667C9.9561 3.16504 9.46259 3.16595 9.0791 3.19727C8.79739 3.22028 8.6076 3.2572 8.46387 3.30859L8.33399 3.36524C8.03176 3.51923 7.77886 3.75343 7.60254 4.04102L7.53125 4.16699C7.4508 4.32498 7.39397 4.53655 7.36328 4.91211C7.33985 5.19893 7.33562 5.54719 7.33399 6.00195H9.33301C10.022 6.00195 10.5791 6.00131 11.0293 6.03809C11.4873 6.07551 11.8937 6.15471 12.2705 6.34668L12.4883 6.46875C12.984 6.7728 13.3878 7.20854 13.6533 7.72949L13.7197 7.87207C13.8642 8.20859 13.9292 8.56974 13.9619 8.9707C13.9987 9.42092 13.998 9.97799 13.998 10.667V12.665ZM18.165 9.33301C18.165 10.022 18.1657 10.5791 18.1289 11.0293C18.0961 11.4302 18.0311 11.7914 17.8867 12.1279L17.8203 12.2705C17.5549 12.7914 17.1509 13.2272 16.6553 13.5313L16.4365 13.6533C16.0599 13.8452 15.6541 13.9245 15.1963 13.9619C14.8593 13.9895 14.4624 13.9935 13.9951 13.9951C13.9935 14.4624 13.9895 14.8593 13.9619 15.1963C13.9292 15.597 13.864 15.9576 13.7197 16.2939L13.6533 16.4365C13.3878 16.9576 12.9841 17.3941 12.4883 17.6982L12.2705 17.8203C11.8937 18.0123 11.4873 18.0915 11.0293 18.1289C10.5791 18.1657 10.022 18.165 9.33301 18.165H6.5C5.81091 18.165 5.25395 18.1657 4.80371 18.1289C4.40306 18.0962 4.04235 18.031 3.70606 17.8867L3.56348 17.8203C3.04244 17.5548 2.60585 17.151 2.30176 16.6553L2.17969 16.4365C1.98788 16.0599 1.90851 15.6541 1.87109 15.1963C1.83431 14.746 1.83496 14.1891 1.83496 13.5V10.667C1.83496 9.978 1.83432 9.42091 1.87109 8.9707C1.90851 8.5127 1.98772 8.10625 2.17969 7.72949L2.30176 7.51172C2.60586 7.0159 3.04236 6.6122 3.56348 6.34668L3.70606 6.28027C4.04237 6.136 4.40303 6.07083 4.80371 6.03809C5.14051 6.01057 5.53708 6.00551 6.00391 6.00391C6.00551 5.53708 6.01057 5.14051 6.03809 4.80371C6.0755 4.34588 6.15483 3.94012 6.34668 3.56348L6.46875 3.34473C6.77282 2.84912 7.20856 2.44514 7.72949 2.17969L7.87207 2.11328C8.20855 1.96886 8.56979 1.90385 8.9707 1.87109C9.42091 1.83432 9.978 1.83496 10.667 1.83496H13.5C14.1891 1.83496 14.746 1.83431 15.1963 1.87109C15.6541 1.90851 16.0599 1.98788 16.4365 2.17969L16.6553 2.30176C17.151 2.60585 17.5548 3.04244 17.8203 3.56348L17.8867 3.70606C18.031 4.04235 18.0962 4.40306 18.1289 4.80371C18.1657 5.25395 18.165 5.81091 18.165 6.5V9.33301Z"></path>
        </svg>
      </button>

      {/* Like button */}
      <button
        type="button"
        aria-label="Thích"
        onClick={handleLike}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLike();
        }}
        disabled={isLikedState === 1}
        className={`cursor-pointer ${isLikedState === 1 ? "not-allowed" : ""}`}
        title={isLikedState === 1 ? "Đã thích" : "Thích"}
      >
        {isLikedState !== 1 ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="#6c757d"
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            style={{ opacity: 0.75 }}
          >
            <path d="M10.9153 1.83987L11.2942 1.88772L11.4749 1.91507C13.2633 2.24201 14.4107 4.01717 13.9749 5.78225L13.9261 5.95901L13.3987 7.6719C13.7708 7.67575 14.0961 7.68389 14.3792 7.70608C14.8737 7.74486 15.3109 7.82759 15.7015 8.03323L15.8528 8.11819C16.5966 8.56353 17.1278 9.29625 17.3167 10.1475L17.347 10.3096C17.403 10.69 17.3647 11.0832 17.2835 11.5098C17.2375 11.7517 17.1735 12.0212 17.096 12.3233L16.8255 13.3321L16.4456 14.7276C16.2076 15.6001 16.0438 16.2356 15.7366 16.7305L15.595 16.9346C15.2989 17.318 14.9197 17.628 14.4866 17.8408L14.2982 17.9258C13.6885 18.1774 12.9785 18.1651 11.9446 18.1651H7.33331C6.64422 18.1651 6.08726 18.1657 5.63702 18.1289C5.23638 18.0962 4.87565 18.031 4.53936 17.8867L4.39679 17.8203C3.87576 17.5549 3.43916 17.151 3.13507 16.6553L3.013 16.4366C2.82119 16.0599 2.74182 15.6541 2.7044 15.1963C2.66762 14.7461 2.66827 14.1891 2.66827 13.5V11.667C2.66827 10.9349 2.66214 10.4375 2.77569 10.0137L2.83722 9.81253C3.17599 8.81768 3.99001 8.05084 5.01397 7.77639L5.17706 7.73928C5.56592 7.66435 6.02595 7.66799 6.66632 7.66799C6.9429 7.66799 7.19894 7.52038 7.33624 7.2803L10.2562 2.16995L10.3118 2.08792C10.4544 1.90739 10.6824 1.81092 10.9153 1.83987ZM7.33136 14.167C7.33136 14.9841 7.33714 15.2627 7.39386 15.4746L7.42999 15.5918C7.62644 16.1686 8.09802 16.6134 8.69171 16.7725L8.87042 16.8067C9.07652 16.8323 9.38687 16.835 10.0003 16.835H11.9446C13.099 16.835 13.4838 16.8228 13.7903 16.6963L13.8997 16.6465C14.1508 16.5231 14.3716 16.3444 14.5433 16.1221L14.6155 16.0166C14.7769 15.7552 14.8968 15.3517 15.1624 14.378L15.5433 12.9824L15.8079 11.9922C15.8804 11.7102 15.9368 11.4711 15.9769 11.2608C16.0364 10.948 16.0517 10.7375 16.0394 10.5791L16.0179 10.4356C15.9156 9.97497 15.641 9.57381 15.2542 9.31253L15.0814 9.20999C14.9253 9.12785 14.6982 9.06544 14.2747 9.03225C13.8477 8.99881 13.2923 8.99807 12.5003 8.99807C12.2893 8.99807 12.0905 8.89822 11.9651 8.72854C11.8398 8.55879 11.8025 8.33942 11.8646 8.13772L12.6556 5.56741L12.7054 5.36331C12.8941 4.35953 12.216 3.37956 11.1878 3.2178L8.49054 7.93948C8.23033 8.39484 7.81431 8.72848 7.33136 8.88967V14.167ZM3.99835 13.5C3.99835 14.2111 3.99924 14.7044 4.03058 15.0879C4.06128 15.4636 4.11804 15.675 4.19854 15.833L4.26886 15.959C4.44517 16.2466 4.69805 16.4808 5.0003 16.6348L5.13019 16.6905C5.27397 16.7419 5.46337 16.7797 5.74542 16.8028C5.97772 16.8217 6.25037 16.828 6.58722 16.8311C6.41249 16.585 6.27075 16.3136 6.1712 16.0215L6.10968 15.8194C5.99614 15.3956 6.00128 14.899 6.00128 14.167V9.00296C5.79386 9.0067 5.65011 9.01339 5.53741 9.02737L5.3587 9.06057C4.76502 9.21965 4.29247 9.66448 4.09601 10.2412L4.06085 10.3584C4.00404 10.5705 3.99835 10.8493 3.99835 11.667V13.5Z"></path>
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="#6c757d"
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            style={{ opacity: 0.75 }}
          >
            <path d="M10.4933 2.24145C10.6705 1.93631 11.0263 1.77698 11.3766 1.84591C12.9688 2.15921 13.9371 3.75763 13.4595 5.28453L12.7524 7.66797H14.0805C16.2694 7.66797 17.8591 9.71567 17.2831 11.7933L16.1515 15.7534C15.7576 17.1743 14.4458 18.16 12.9488 18.16L7.97157 18.16C7.0564 18.1583 6.31505 17.4278 6.31505 16.527V7.66797H6.93102C7.22884 7.66797 7.50382 7.38853 7.65157 7.13413L10.4933 2.24145Z"></path>
            <path d="M4.98959 7.66797C3.61457 7.66797 2.66748 8.80749 2.66748 10.1603V15.7534C2.66748 17.1062 3.61457 18.16 4.98959 18.16H5.4337C5.15125 17.6796 4.98959 17.1219 4.98959 16.527V7.66797Z"></path>
          </svg>
        )}
      </button>

      {/* Brick button */}
      <button
        type="button"
        aria-label="Ném gạch"
        onClick={handleBrick}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleBrick();
        }}
        className="cursor-pointer hidden"
        title="Ném gạch"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6c757d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.75 }}
          aria-hidden="true"
        >
          <path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z"></path>
          <path d="M10 22v-8L2.25 9.15"></path>
          <path d="m10 14 11.77-6.87"></path>
        </svg>
      </button>

      {/* Brick Comment Modal */}
      {showBrickModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowBrickModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>Ném gạch</h3>
            <textarea
              value={brickComment}
              onChange={(e) => setBrickComment(e.target.value)}
              placeholder="Nhập lý do ném gạch (1-2000 ký tự)..."
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                resize: "vertical",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowBrickModal(false);
                  setBrickComment("");
                }}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleBrickSubmit}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  background: "#dc3545",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageActions;
