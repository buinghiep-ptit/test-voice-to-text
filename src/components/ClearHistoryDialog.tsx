interface Props {
  cancelClear: () => void;
  confirmClear: () => void;
}

const ClearHistoryDialog = ({ cancelClear, confirmClear }: Props) => {
  return (
    <div className="modal-overlay" onClick={cancelClear}>
      <div className="bg-white rounded-xl p-6! max-w-sm w-full shadow-xl transform transition-all animate-fade-in">
        <h3 className="modal-title font-semibold! mb-6!">
          Làm mới phiên trò chuyện?
        </h3>
        <p className="mb-5! text-sm!">
          Chang sẽ quên các thông tin đã trao đổi trước đó và sẽ chạy lại.{" "}
          <br /> Vui lòng hỏi lại câu hỏi để nhận được câu trả lời chính xác dựa
          trên dữ liệu mới. Bạn có muốn làm mới không?
        </p>
        <div className="flex justify-end space-x-3!">
          <button
            onClick={cancelClear}
            className="cursor-pointer px-4! py-2! rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Không
          </button>
          <button
            onClick={confirmClear}
            className="btn-submit cursor-pointer px-4! py-2! !rounded-xl text-white transition-colors"
          >
            Có
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearHistoryDialog;
