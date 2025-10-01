interface Props {
  cancelClear: () => void;
  confirmClear: () => void;
}

const ClearHistoryDialog = ({ cancelClear, confirmClear }: Props) => {
  return (
    <div className="fixed inset-0 flex items-center bg-black/50 justify-center z-1000! p-4!">
      <div className="bg-white rounded-xl p-6! max-w-sm w-full shadow-xl transform transition-all animate-fade-in">
        <h3 className="font-semibold! mb-3!">Xoá lịch sử trò chuyện?</h3>
        <p className="mb-5! text-sm!">
          Bạn có chắc chắn muốn xoá lịch sử trò chuyện không?
        </p>
        <div className="flex justify-end space-x-3!">
          <button
            onClick={cancelClear}
            className="cursor-pointer px-4! py-2! rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={confirmClear}
            className="cursor-pointer px-4! py-2! rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearHistoryDialog;
