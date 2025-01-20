"use client";

import React, { useEffect } from "react";

interface SearchResultsProps {
  query?: string | string[];
}

const SearchResults = ({ query }: SearchResultsProps) => {
  useEffect(() => {
    if (!document.querySelector('script[src*="cse.google.com"]')) {
      const script = document.createElement("script");
      script.src = "https://cse.google.com/cse.js?cx=01a440783ba554677";
      script.async = true;
      document.head.appendChild(script);
    }

    const intervalId = setInterval(() => {
      if (window.google) {
        window.google.search.cse.element.render({
          div: "searchresults",
          tag: "searchresults-only",
          gname: "gsearch",
        });

        const searchElement =
          window.google.search.cse.element.getElement("gsearch");
        if (searchElement && query) {
          const queryString = Array.isArray(query) ? query[0] : query;
          searchElement.execute(queryString);
        }

        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [query]);

  return (
    <div className="w-full">
      {query ? (
        <div id="searchresults" className="gcse-searchresults-only"></div>
      ) : (
        <p className="text-gray-600">Please enter a search query</p>
      )}
    </div>
  );
};

export default SearchResults;
