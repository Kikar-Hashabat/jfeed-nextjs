import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  baseUrl,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  // Create array of page numbers to show
  const pages = [];
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pages.push(i);
  }

  const getPageUrl = (page: number) => {
    // If it's page 1, don't add the page parameter
    if (page === 1) return baseUrl;
    return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${page}`;
  };

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Previous
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
