export default function Pagination({
    page,
    setPage,
    pages,
}: {
    page: number;
    pages: number;
    setPage: (data: number) => void;
}) {
    return (
        <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
                Page {page} of {pages}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    className={`px-3 py-1 rounded text-sm transition-colors ${page === 1 ? "cursor-not-allowed bg-gray-900" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                    Prev
                </button>
                <button
                    onClick={() => setPage(Math.min(page + 1, pages))}
                    className={`px-3 py-1 rounded text-sm transition-colors ${page === pages ? "cursor-not-allowed bg-gray-900" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
