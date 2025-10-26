export default function Pagination({
    page,
    setPage,
    pages,
}: {
    page: number;
    pages: number;
    setPage: () => void;
}) {
    const prev = () => 1;
    const next = () => 3;
    return (
        <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
                Page {page} of {pages}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={prev}
                    className="px-3 py-1 rounded bg-gray-800 text-sm"
                >
                    Prev
                </button>
                <button
                    onClick={next}
                    className="px-3 py-1 rounded bg-gray-800 text-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
