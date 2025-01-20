"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    google: {
      search: {
        cse: {
          element: {
            render: (options: {
              div: string;
              tag: "searchbox-only" | "searchresults-only";
              gname: string;
            }) => void;
            getElement: (gname: string) => {
              execute: (query: string) => void;
              clearAllResults: () => void;
            };
          };
        };
      };
    };
  }
}

const SearchBox = () => {
  // Lazy load Google CSE script
  const loadGoogleCSE = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://cse.google.com/cse.js?cx=01a440783ba554677";
      script.defer = true;
      script.onload = resolve;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadGoogleCSE();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        id="searchbox"
        className="gcse-searchbox-only"
        data-resultsurl="/search"
      ></div>
    </div>
  );
};

export default SearchBox;
