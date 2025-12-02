export default function DeleteConfirmDialog({
    onCancel,
    onDelete,
}: {
    onCancel: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="bg-neutral-900 rounded-lg p-5 shadow-xl w-72 border border-neutral-700">
                <h2 className="text-lg font-semibold mb-3 text-white">
                    Confirm Delete
                </h2>
                <p className="text-sm text-neutral-400 mb-4">
                    Are you sure you want to delete this item?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1 rounded bg-black-800 text-neutral-300 hover:bg-neutral-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onDelete();
                        }}
                        className="px-3 py-1  bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
