import React, { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { commentService, FrontendComment } from "@/services/commentService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Comment {
  id: string;
  commentId: string;
  author: string;
  content: string;
  replies: Comment[];
  likesCount: number;
  isOwnerReply?: boolean;
  isLiked?: boolean;
}

interface CommentSectionProps {
  projectId: string;
  isOwner: boolean;
  currentUser: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  projectId,
  isOwner,
  currentUser,
}) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingComment, setAddingComment] = useState(false);
  const [addingReply, setAddingReply] = useState<string | null>(null);
  const [likingComment, setLikingComment] = useState<string | null>(null);

  // Fetch comments when component mounts or projectId changes
  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentData = await commentService.getComments(projectId);
      
      // Convert backend comments to frontend format and structure replies
      const backendComments = commentData.map(comment => 
        commentService.mapToFrontendComment(comment)
      );
      
      // Structure comments with replies
      const structuredComments = structureComments(backendComments);
      setComments(structuredComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const structureComments = (allComments: FrontendComment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments
    allComments.forEach(comment => {
      commentMap.set(comment.commentId, {
        ...comment,
        replies: [],
        isOwnerReply: comment.author === currentUser
      });
    });

    // Second pass: build hierarchy
    allComments.forEach(comment => {
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
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Reply added successfully",
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    } finally {
      setAddingReply(null);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      setLikingComment(commentId);
      await commentService.likeComment(commentId);
      
      // Refresh comments to get updated like counts
      await fetchComments();
      
      toast({
        title: "Success",
        description: "Comment liked",
      });
    } catch (error) {
      console.error('Error liking comment:', error);
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      });
    } finally {
      setLikingComment(null);
    }
  };


  return (
    <div className="comment-section space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {/* New Comment Input */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none"
            />
            <Button
              onClick={handleAddComment}
              disabled={addingComment || newComment.trim() === ""}
              className="w-full"
            >
              {addingComment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{comment.author}</span>
                    {comment.isOwnerReply && (
                      <Badge variant="secondary" className="text-xs">
                        Owner
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.commentId)}
                    disabled={likingComment === comment.commentId}
                    className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  >
                    {likingComment === comment.commentId ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Heart
                        size={14}
                        fill={comment.isLiked ? "currentColor" : "none"}
                        className={comment.isLiked ? "text-destructive" : ""}
                      />
                    )}
                    <span className="ml-1 text-xs">{comment.likesCount}</span>
                  </Button>
                </div>
                
                <p className="text-sm whitespace-pre-wrap mb-3">{comment.content}</p>

                {/* Reply Button */}
                {isOwner && replyingTo !== comment.id && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-8 px-0 text-xs"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    Reply
                  </Button>
                )}

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      placeholder="Write a reply..."
                      rows={2}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="resize-none text-sm"
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddReply(comment.id)}
                        disabled={addingReply === comment.id || replyContent.trim() === ""}
                      >
                        {addingReply === comment.id ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Post Reply"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies List */}
                {comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3 border-t pt-3">
                    {comment.replies.map((reply) => (
                      <Card key={reply.id} className="bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-xs">{reply.author}</span>
                              {reply.isOwnerReply && (
                                <Badge variant="secondary" className="text-xs">
                                  Owner
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikeComment(reply.commentId)}
                              disabled={likingComment === reply.commentId}
                              className="h-6 px-1 text-muted-foreground hover:text-destructive"
                            >
                              {likingComment === reply.commentId ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Heart
                                  size={12}
                                  fill={reply.isLiked ? "currentColor" : "none"}
                                  className={reply.isLiked ? "text-destructive" : ""}
                                />
                              )}
                              <span className="ml-1 text-xs">{reply.likesCount}</span>
                            </Button>
                          </div>
                          <p className="text-xs whitespace-pre-wrap">{reply.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
