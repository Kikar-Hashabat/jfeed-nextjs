"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

interface ArticleFeedbackProps {
  articleId: number;
  initialLikes: number;
  initialDislikes: number;
  initialComments: number;
}

const ArticleFeedback: React.FC<ArticleFeedbackProps> = ({
  articleId,
  initialLikes,
  initialDislikes,
  initialComments,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);

  const handleLike = async () => {
    if (userAction === "like") {
      setLikes((prev) => prev - 1);
      setUserAction(null);
    } else {
      if (userAction === "dislike") {
        setDislikes((prev) => prev - 1);
      }
      setLikes((prev) => prev + 1);
      setUserAction("like");
    }

    try {
      await fetch(`/api/articles/${articleId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to register like:", error);
    }
  };

  const handleDislike = async () => {
    if (userAction === "dislike") {
      setDislikes((prev) => prev - 1);
      setUserAction(null);
    } else {
      if (userAction === "like") {
        setLikes((prev) => prev - 1);
      }
      setDislikes((prev) => prev + 1);
      setUserAction("dislike");
    }

    try {
      await fetch(`/api/articles/${articleId}/dislike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to register dislike:", error);
    }
  };

  return (
    <div className="flex items-center gap-6 text-sm text-gray-600">
      <button
        onClick={handleLike}
        className={`flex items-center gap-1 hover:text-primary transition-colors ${
          userAction === "like" ? "text-primary" : ""
        }`}
      >
        <ThumbsUp size={18} />
        <span>{likes}</span>
      </button>

      <button
        onClick={handleDislike}
        className={`flex items-center gap-1 hover:text-primary transition-colors ${
          userAction === "dislike" ? "text-primary" : ""
        }`}
      >
        <ThumbsDown size={18} />
        <span>{dislikes}</span>
      </button>

      <a
        href="#comments"
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <MessageSquare size={18} />
        <span>{initialComments}</span>
      </a>
    </div>
  );
};

export default ArticleFeedback;
