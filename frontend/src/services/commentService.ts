const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL as string;

export interface CommentData {
  commentId: string;
  projectId: string;
  author: string;
  content: string;
  parentCommentId?: string;
  likesCount: number;
  createdAt: string;
}

export interface FrontendComment {
  id: string;
  commentId: string;
  author: string;
  content: string;
  parentCommentId?: string;
  replies: FrontendComment[];
  likesCount: number;
  isOwnerReply?: boolean;
  isLiked?: boolean;
  createdAt?: string;
}

export interface CreateCommentRequest {
  commentId: string;
  projectId: string;
  author: string;
  content: string;
  parentCommentId?: string;
  likesCount?: number;
}

export const commentService = {
  // Fetch comments for a project
  async getComments(projectId: string): Promise<CommentData[]> {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/projects/comments?projectId=${encodeURIComponent(
          projectId
        )}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }

      const data = await response.json();
      return data.comments || [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Add a new comment or reply
  async addComment(commentData: CreateCommentRequest): Promise<CommentData> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/projects/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }

      const data = await response.json();
      return data.comment;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Like/Unlike a comment (toggle functionality)
  async toggleCommentLike(
    commentId: string,
    userEmail: string
  ): Promise<{ action: string; likesCount: string }> {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/projects/comments/${encodeURIComponent(
          commentId
        )}/like`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to toggle comment like: ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        action: data.action,
        likesCount: data.likesCount,
      };
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  },

  // Check if user has liked a comment
  async checkCommentLiked(
    commentId: string,
    userEmail: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/projects/comments/${encodeURIComponent(
          commentId
        )}/liked?userEmail=${encodeURIComponent(userEmail)}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to check comment like status: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.hasLiked || false;
    } catch (error) {
      console.error("Error checking comment like status:", error);
      return false;
    }
  },

  // Edit an existing comment or reply
  async editComment(
    commentId: string,
    content: string,
    author: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/projects/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            author,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to edit comment: ${response.statusText}`);
      }

      const data = await response.json();
      return data.comment;
    } catch (error) {
      console.error("Error editing comment:", error);
      throw error;
    }
  },

  // Helper function to generate unique comment IDs
  generateCommentId(): string {
    return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Convert backend comment data to frontend comment format
  mapToFrontendComment(comment: CommentData, isLiked = false): FrontendComment {
    return {
      id: comment.commentId,
      commentId: comment.commentId,
      author: comment.author,
      content: comment.content,
      parentCommentId: comment.parentCommentId,
      likesCount: comment.likesCount,
      createdAt: comment.createdAt,
      isLiked,
      replies: [],
      isOwnerReply: false, // This will be set based on the current user
    };
  },
};
