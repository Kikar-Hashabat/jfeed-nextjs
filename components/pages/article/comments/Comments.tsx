"use client";

import React, { useState, useEffect } from "react";
import { formatDateAndTime } from "@/utils/date";
import { Alert, AlertDescription } from "@/components/Alert";
import { v4 as uuidv4 } from "uuid";
import { getArticleComments, submitComment, reportComment } from "@/utils/api";
import { ReportPayload } from "@/types/article";
import Title from "@/components/Title";

export interface Comment {
  id: number;
  name: string;
  content: string;
  time: number;
  subComments: Comment[];
}

interface CommentsProps {
  articleId: number;
  totalComments: number;
}

interface CommentFormProps {
  onSubmit: (name: string, content: string) => Promise<void>;
  isReply?: boolean;
}

interface FeedbackMessage {
  type: "success" | "error";
  text: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isReply = false,
}) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<FeedbackMessage | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await onSubmit(name, content);
      setName("");
      setContent("");
      // Only show success message for main comments, not replies
      if (!isReply) {
        setMessage({
          type: "success",
          text: "Comment submitted successfully! It will be reviewed by our editors.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
        className="w-full px-2 py-1 border border-gray-300 rounded my-2 font-inherit"
      />

      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isReply ? "Your Reply" : "Comment"}
        required
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded my-3 font-inherit"
      />

      <div className="flex items-start justify-between">
        <span className="text-sm text-gray-600 flex-1 mr-4">
          Do not send comments that include inflammatory words, defamation, and
          content that exceeds the limit of good taste.
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded text-sm leading-normal shadow-md hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "SENDING..." : "SEND"}
        </button>
      </div>

      {message && (
        <div className="mt-3">
          <Alert variant={message.type === "error" ? "error" : "success"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        </div>
      )}
    </form>
  );
};

interface CommentProps {
  comment: Comment;
  depth?: number;
  index: number;
  onReply: (parentId: number, name: string, content: string) => Promise<void>;
  onReport: (
    commentId: number,
    reason: ReportPayload["reason"]
  ) => Promise<void>;
}

const CommentItem: React.FC<CommentProps> = ({
  comment,
  depth = 0,
  index,
  onReply,
  onReport,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportMessage, setReportMessage] = useState<FeedbackMessage | null>(
    null
  );
  const [replyMessage, setReplyMessage] = useState<FeedbackMessage | null>(
    null
  );

  const handleToggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
    if (showReportForm) setShowReportForm(false);
  };

  const handleToggleReportForm = () => {
    setShowReportForm(!showReportForm);
    if (showReplyForm) setShowReplyForm(false);
  };

  const handleReply = async (name: string, content: string) => {
    try {
      await onReply(comment.id, name, content);
      setReplyMessage({
        type: "success",
        text: "Reply submitted successfully! It will be reviewed by our editors.",
      });
      setTimeout(() => {
        setShowReplyForm(false);
        setReplyMessage(null);
      }, 2000);
    } catch (error) {
      setReplyMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit reply",
      });
    }
  };

  const handleReport = async (reason: ReportPayload["reason"]) => {
    try {
      await onReport(comment.id, reason);
      setReportMessage({
        type: "success",
        text: "Comment reported successfully",
      });
      setTimeout(() => {
        setShowReportForm(false);
        setReportMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error in handleReport:", error);
      setReportMessage({
        type: "error",
        text: "Failed to report comment",
      });
    }
  };

  return (
    <div className="flex mb-4">
      {depth === 0 && <div className="pr-2 pt-7 text-gray-600">{index}</div>}
      <div className="relative mt-2.5 w-full">
        <div className="bg-gray-50 p-4 rounded text-sm">{comment.content}</div>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
          <div>
            <span className="font-bold text-gray-900">{comment.name}</span>
            <span className="ml-2">{formatDateAndTime(comment.time)}</span>
          </div>
          <div className="flex">
            {depth < 2 && (
              <button
                onClick={handleToggleReplyForm}
                className="px-2 py-2 hover:bg-gray-100 text-sm"
              >
                Reply
              </button>
            )}
            <button
              onClick={handleToggleReportForm}
              className="px-2 py-2 hover:bg-gray-100 text-sm"
            >
              Report
            </button>
          </div>
        </div>

        {showReportForm && (
          <div className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2.5 before:h-6 before:border-b-2 before:border-l-2 before:border-gray-200 before:rounded-bl-lg">
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded">
              <h4 className="font-medium mb-3">Report this comment</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`report-reason-${comment.id}`}
                    value="problematic-content"
                    onChange={(e) =>
                      handleReport(e.target.value as ReportPayload["reason"])
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">
                    Comment with problematic content
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`report-reason-${comment.id}`}
                    value="dirty-words"
                    onChange={(e) =>
                      handleReport(e.target.value as ReportPayload["reason"])
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">
                    Comment with inappropriate language
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`report-reason-${comment.id}`}
                    value="disrespectful"
                    onChange={(e) =>
                      handleReport(e.target.value as ReportPayload["reason"])
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">Disrespectful content</span>
                </label>
              </div>
              {reportMessage && (
                <Alert
                  variant={reportMessage.type === "error" ? "error" : "success"}
                >
                  <AlertDescription>{reportMessage.text}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {showReplyForm && (
          <div className="relative pl-4 mt-3 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2.5 before:h-6 before:border-b-2 before:border-l-2 before:border-gray-200 before:rounded-bl-lg">
            <CommentForm onSubmit={handleReply} isReply />
            {replyMessage && (
              <Alert
                variant={replyMessage.type === "error" ? "error" : "success"}
              >
                <AlertDescription>{replyMessage.text}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {comment.subComments?.length > 0 && (
          <div className="pl-4 mt-3 relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-2.5 before:h-6 before:border-b-2 before:border-l-2 before:border-gray-200 before:rounded-bl-lg">
            {comment.subComments.map((subComment) => (
              <CommentItem
                key={subComment.id}
                comment={subComment}
                depth={depth + 1}
                index={index}
                onReply={onReply}
                onReport={onReport}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Comments: React.FC<CommentsProps> = ({ articleId, totalComments }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleComments, setVisibleComments] = useState<number>(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getArticleComments(articleId.toString());
        setComments(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError("Failed to load comments");
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleSubmitComment = async (
    name: string,
    content: string,
    parentId?: number
  ) => {
    try {
      if (!name.trim() || !content.trim()) {
        throw new Error("Name and content are required");
      }

      const payload = {
        name: name.trim(),
        content: content.trim(),
        uuid: uuidv4(),
        ...(parentId && { parent: parentId }),
      };

      await submitComment(articleId.toString(), payload);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = await getArticleComments(articleId.toString());
      setComments(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error in handleSubmitComment:", error);
      throw error;
    }
  };

  const handleReportComment = async (
    commentId: number,
    reason: ReportPayload["reason"]
  ) => {
    try {
      await reportComment(articleId.toString(), commentId, { reason });
    } catch (error) {
      console.error("Error in handleReportComment:", error);
      throw error;
    }
  };

  const handleShowMore = () => {
    setVisibleComments((prev) => prev + 5);
  };

  if (loading)
    return (
      <div className="text-center py-8 text-gray-600">Loading comments...</div>
    );

  if (error)
    return (
      <Alert variant="error">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <Title
        title={`${totalComments} ${
          totalComments === 1 ? "Comment" : "Comments"
        }`}
        tag="h2"
      />
      <CommentForm
        onSubmit={(name, content) => handleSubmitComment(name, content)}
      />

      <div className="space-y-4">
        {comments.slice(0, visibleComments).map((comment, index) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            index={index + 1}
            onReply={(parentId, name, content) =>
              handleSubmitComment(name, content, parentId)
            }
            onReport={handleReportComment}
          />
        ))}
      </div>

      {comments.length > visibleComments && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Show More Comments
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;
