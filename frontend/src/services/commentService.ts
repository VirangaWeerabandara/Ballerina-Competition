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
        `${BACKEND_BASE_URL}/projects/comments?projectId=${encodeURIComponent(projectId)}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.comments || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a new comment or reply
  async addComment(commentData: CreateCommentRequest): Promise<CommentData> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/projects/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Like a comment
  async likeComment(commentId: string): Promise<void> {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/projects/comments/${encodeURIComponent(commentId)}/like`,
        {
          method: 'PUT',
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to like comment: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
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
      likesCount: comment.likesCount,
      isLiked,
      replies: [],
      isOwnerReply: false, // This will be set based on the current user
    };
  },
};
