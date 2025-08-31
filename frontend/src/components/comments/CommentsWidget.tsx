import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Loader2,
  Edit3,
  X,
  Reply,
  Clock,
  User,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { commentService, FrontendComment } from "@/services/commentService";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  commentId: string;
  author: string;
  content: string;
  replies: Comment[];
  likesCount: number;
  isOwnerReply?: boolean;
  isLiked?: boolean;
  createdAt?: string;
}

interface CommentsWidgetProps {
  projectId: string;
  isOwner: boolean;
  currentUser: string;
  defaultOpen?: boolean;
  onClose?: () => void;
}

const CommentsWidget: React.FC<CommentsWidgetProps> = ({
  projectId,
  isOwner,
  currentUser,
  defaultOpen = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingComment, setAddingComment] = useState(false);
  const [addingReply, setAddingReply] = useState<string | null>(null);
  const [likingComment, setLikingComment] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const newCommentRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  // Focus on comment input when opened
  useEffect(() => {
    if (isOpen && newCommentRef.current) {
      setTimeout(() => newCommentRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Fetch comments when component mounts or projectId changes
  useEffect(() => {
    if (isOpen && projectId) {
      fetchComments();
    }
  }, [projectId, isOpen]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentData = await commentService.getComments(projectId);

      // Convert backend comments to frontend format and structure replies
      const backendComments = commentData.map((comment) =>
        commentService.mapToFrontendComment(comment)
      );

      // Check which comments the current user has liked
      const commentsWithLikeStatus = await Promise.all(
        backendComments.map(async (comment) => {
          const isLiked = await commentService.checkCommentLiked(
            comment.commentId,
            currentUser
          );
          return { ...comment, isLiked };
        })
      );

      // Structure comments with replies
      const structuredComments = structureComments(commentsWithLikeStatus);
      setComments(structuredComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const structureComments = (allComments: FrontendComment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments
    allComments.forEach((comment) => {
      commentMap.set(comment.commentId, {
        ...comment,
        replies: [],
        isOwnerReply: comment.author === currentUser,
      });
    });

    // Second pass: build hierarchy
    allComments.forEach((comment) => {
      const frontendComment = commentMap.get(comment.commentId);
      if (frontendComment && comment.parentCommentId) {
        const parentComment = commentMap.get(comment.parentCommentId);
        if (parentComment) {
          parentComment.replies.push(frontendComment);
        }
      } else if (frontendComment) {
        rootComments.push(frontendComment);
      }
    });

    return rootComments;
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      setAddingComment(true);
      const commentId = commentService.generateCommentId();

      const commentData = {
        commentId,
        projectId,
        author: currentUser,
        content: newComment.trim(),
        likesCount: 0,
      };

      await commentService.addComment(commentData);

      // Refresh comments to get the latest data
      await fetchComments();

      setNewComment("");
      toast.success("Comment added successfully");

      // Focus back on input for better UX
      setTimeout(() => newCommentRef.current?.focus(), 100);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (replyContent.trim() === "") return;

    try {
      setAddingReply(parentId);
      const commentId = commentService.generateCommentId();

      const commentData = {
        commentId,
        projectId,
        author: currentUser,
        content: replyContent.trim(),
        parentCommentId: parentId,
        likesCount: 0,
      };

      await commentService.addComment(commentData);

      // Refresh comments to get the latest data
      await fetchComments();

      setReplyContent("");
      setReplyingTo(null);
      toast.success("Reply added successfully");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setAddingReply(null);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      setLikingComment(commentId);
      const result = await commentService.toggleCommentLike(
        commentId,
        currentUser
      );

      // Update the local state to reflect the like/unlike action
      setComments((prevComments) => {
        const updateCommentLikes = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.commentId === commentId) {
              const newLikesCount =
                result.action === "liked"
                  ? comment.likesCount + 1
                  : Math.max(comment.likesCount - 1, 0);

              return {
                ...comment,
                likesCount: newLikesCount,
                isLiked: result.action === "liked",
              };
            }

            // Update replies as well
            if (comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentLikes(comment.replies),
              };
            }

            return comment;
          });
        };

        return updateCommentLikes(prevComments);
      });

      toast.success(
        result.action === "liked" ? "Comment liked" : "Comment unliked"
      );
    } catch (error) {
      console.error("Error toggling comment like:", error);
      toast.error("Failed to update comment like");
    } finally {
      setLikingComment(null);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (editContent.trim() === "") return;

    try {
      await commentService.editComment(
        commentId,
        editContent.trim(),
        currentUser
      );

      // Update the local state to reflect the edit
      setComments((prevComments) => {
        const updateCommentContent = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.commentId === commentId) {
              return {
                ...comment,
                content: editContent.trim(),
              };
            }

            // Update replies as well
            if (comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentContent(comment.replies),
              };
            }

            return comment;
          });
        };

        return updateCommentContent(prevComments);
      });

      setEditContent("");
      setEditingComment(null);
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const startEditing = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const toggleComments = () => {
    setIsOpen(!isOpen);
  };

  const closeComments = () => {
    setIsOpen(false);
    setNewComment("");
    setReplyingTo(null);
    setReplyContent("");
    onClose?.();
  };

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp || timestamp === "now" || timestamp === "") {
      return "Just now";
    }

    try {
      const now = new Date();
      const commentTime = new Date(timestamp);

      // Check if the date is valid
      if (isNaN(commentTime.getTime())) {
        return "Just now";
      }

      const diffInSeconds = Math.floor(
        (now.getTime() - commentTime.getTime()) / 1000
      );

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch (error) {
      console.warn("Error formatting timestamp:", timestamp, error);
      return "Just now";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Comments Panel - Slides in from right */}
      <div
        className={cn(
          "fixed z-40 transition-all duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          "top-0 right-0 w-96 h-full"
        )}
      >
        {/* Backdrop for better visual separation */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent pointer-events-none transition-opacity duration-300" />

        {/* Main Comments Panel */}
        <div
          className={cn(
            "relative bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out",
            "flex flex-col",
            "w-96 h-full border-l border-l-border/50"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30">
                  <Edit3 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-foreground text-lg">
                  Comments
                </h3>
                <span className="text-xs text-muted-foreground">
                  {comments.length} comment{comments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeComments}
                className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background via-background to-muted/10">
            {/* New Comment Input */}
            <div className="space-y-3 bg-white/50 rounded-lg p-4 border border-border/50 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {getInitials(currentUser)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    ref={newCommentRef}
                    placeholder="Share your thoughts..."
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none border-0 focus-visible:ring-2 focus-visible:ring-primary/20 bg-transparent placeholder:text-muted-foreground/60"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {newComment.length}/500
                    </span>
                    <Button
                      onClick={handleAddComment}
                      disabled={addingComment || newComment.trim() === ""}
                      size="sm"
                      className="px-4 py-2 h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {addingComment ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-3 w-3" />
                          Post
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Loading comments...
                  </span>
                </div>
              </div>
            ) : comments.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <Edit3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">
                  No comments yet
                </h4>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your thoughts on this project!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white/50 rounded-lg p-4 border border-border/50 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Comment Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground truncate">
                            {comment.author}
                          </span>
                          {comment.isOwnerReply && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              Owner
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {comment.createdAt
                              ? formatTimeAgo(comment.createdAt)
                              : "Just now"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comment Content */}
                    {editingComment === comment.commentId ? (
                      <div className="mb-4 space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="resize-none border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditComment(comment.commentId)}
                            disabled={editContent.trim() === ""}
                            className="px-3 py-1 h-7 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditing}
                            className="px-3 py-1 h-7 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground whitespace-pre-wrap mb-4 leading-relaxed">
                        {comment.content}
                      </p>
                    )}

                    {/* Comment Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.commentId)}
                          disabled={likingComment === comment.commentId}
                          className="h-8 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                        >
                          {likingComment === comment.commentId ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                          ) : (
                            <Heart
                              size={14}
                              fill={comment.isLiked ? "currentColor" : "none"}
                              className={cn(
                                "mr-2 transition-all duration-200",
                                comment.isLiked ? "text-destructive" : ""
                              )}
                            />
                          )}
                          <span className="text-xs font-medium">
                            {comment.likesCount}
                          </span>
                        </Button>

                        {/* Edit Icon */}
                        {comment.author === currentUser &&
                          editingComment !== comment.commentId && (
                            <button
                              onClick={() =>
                                startEditing(comment.commentId, comment.content)
                              }
                              className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200"
                              title="Edit comment"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}

                        {/* Reply Button */}
                        {isOwner && replyingTo !== comment.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                            onClick={() => setReplyingTo(comment.id)}
                          >
                            <Reply className="h-3 w-3 mr-2" />
                            Reply
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {getInitials(currentUser)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Write a reply..."
                              rows={2}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="resize-none border-0 focus-visible:ring-2 focus-visible:ring-primary/20 bg-transparent placeholder:text-muted-foreground/60 text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddReply(comment.id)}
                                disabled={
                                  addingReply === comment.id ||
                                  replyContent.trim() === ""
                                }
                                className="px-3 py-1 h-7 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                              >
                                {addingReply === comment.id ? (
                                  <>
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Posting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-1 h-3 w-3" />
                                    Reply
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent("");
                                }}
                                className="px-3 py-1 h-7 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies List */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 space-y-3 pt-4 border-t border-border/50">
                        <div className="text-xs font-medium text-muted-foreground mb-3">
                          {comment.replies.length} repl
                          {comment.replies.length === 1 ? "y" : "ies"}
                        </div>
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-muted/30 rounded-lg p-3 ml-8 border-l-2 border-l-primary/20"
                          >
                            {/* Reply Header */}
                            <div className="flex items-start gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                  {getInitials(reply.author)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-xs text-foreground truncate">
                                    {reply.author}
                                  </span>
                                  {reply.isOwnerReply && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-1.5 py-0.5"
                                    >
                                      Owner
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-2.5 w-2.5" />
                                  <span>
                                    {reply.createdAt
                                      ? formatTimeAgo(reply.createdAt)
                                      : "Just now"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Reply Content */}
                            {editingComment === reply.commentId ? (
                              <div className="mb-3 space-y-2">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) =>
                                    setEditContent(e.target.value)
                                  }
                                  rows={2}
                                  className="resize-none border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 text-xs"
                                />
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleEditComment(reply.commentId)
                                    }
                                    disabled={editContent.trim() === ""}
                                    className="px-2 py-1 h-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={cancelEditing}
                                    className="px-2 py-1 h-6 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-foreground whitespace-pre-wrap mb-3 leading-relaxed">
                                {reply.content}
                              </p>
                            )}

                            {/* Reply Actions */}
                            <div className="flex items-center gap-2">
                              {/* Edit Icon for Reply */}
                              {reply.author === currentUser &&
                                editingComment !== reply.commentId && (
                                  <button
                                    onClick={() =>
                                      startEditing(
                                        reply.commentId,
                                        reply.content
                                      )
                                    }
                                    className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200"
                                    title="Edit reply"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                )}

                              {/* Like Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleLikeComment(reply.commentId)
                                }
                                disabled={likingComment === reply.commentId}
                                className="h-6 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                              >
                                {likingComment === reply.commentId ? (
                                  <Loader2 className="h-2.5 w-2.5 animate-spin mr-1" />
                                ) : (
                                  <Heart
                                    size={12}
                                    fill={
                                      reply.isLiked ? "currentColor" : "none"
                                    }
                                    className={cn(
                                      "mr-1 transition-all duration-200",
                                      reply.isLiked ? "text-destructive" : ""
                                    )}
                                  />
                                )}
                                <span className="text-xs font-medium">
                                  {reply.likesCount}
                                </span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Scroll to bottom reference */}
            <div ref={commentsEndRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentsWidget;
