import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(currentPage, totalPages) {
  const delta = 1; 
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const { t } = useTranslation();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between mt-4 text-sm flex-wrap gap-3">
      <p className="text-gray-500">
        {t("pagination.showing", {
          start: startItem,
          end: endItem,
          total: totalItems,
        })}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={t("pagination.prev")}
          className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
        >
          <ChevronLeft size={16} className="rtl:rotate-180" />
        </button>

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm cursor-pointer ${
                page === currentPage ? "bg-primary-500 text-white" : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label={t("pagination.next")}
          className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
        >
          <ChevronRight size={16} className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}