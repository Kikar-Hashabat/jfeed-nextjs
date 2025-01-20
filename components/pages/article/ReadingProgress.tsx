"use client";

import React, { useEffect, useState } from "react";

const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const totalHeight = article.clientHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const currentProgress = (scrollY / (totalHeight - windowHeight)) * 100;

      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-primary transition-transform duration-150"
        style={{ transform: `translateX(${progress - 100}%)` }}
      />
    </div>
  );
};

export default ReadingProgress;
