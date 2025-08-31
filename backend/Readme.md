# Comment System Documentation

This document describes the comment system implementation including the database schema, API endpoints, and frontend integration.

## Database Schema

### Comment Table

```sql
CREATE TABLE Comment (
    commentId VARCHAR(255) PRIMARY KEY,
    projectId VARCHAR(255) NOT NULL REFERENCES Project(projectId) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    parentCommentId VARCHAR(255) REFERENCES Comment(commentId) ON DELETE CASCADE,
    likesCount INTEGER DEFAULT 0,
    createdAt VARCHAR(255) NOT NULL
);
```

### CommentLike Table

```sql
CREATE TABLE CommentLike (
    commentId VARCHAR(255) NOT NULL REFERENCES Comment(commentId) ON DELETE CASCADE,
    userEmail VARCHAR(255) NOT NULL,
    createdAt VARCHAR(255) NOT NULL,
    PRIMARY KEY (commentId, userEmail)
);
```

## API Endpoints

### 1. Get Comments

- **GET** `/api/projects/comments?projectId={projectId}`
- **Response**: List of all comments for a project
- **Features**: Returns comments with replies, timestamps, and like counts

### 2. Add Comment/Reply

- **POST** `/api/projects/comments`
- **Body**:
  ```json
  {
    "commentId": "unique_id",
    "projectId": "project_id",
    "author": "user@example.com",
    "content": "Comment text",
    "parentCommentId": "optional_parent_id",
    "likesCount": 0
  }
  ```
- **Response**: Created comment with timestamp

### 3. Edit Comment/Reply

- **PUT** `/api/projects/comments/{commentId}`
- **Body**:
  ```json
  {
    "content": "Updated comment text",
    "author": "user@example.com"
  }
  ```
- **Response**: Updated comment details
- **Security**: Only the original author can edit their comment
- **Features**: Updates content while preserving other metadata

### 4. Toggle Comment Like/Unlike

- **PUT** `/api/projects/comments/{commentId}/like`
- **Body**: `{ "userEmail": "user@example.com" }`
- **Response**:
  ```json
  {
    "message": "Comment liked/unliked successfully",
    "action": "liked" | "unliked",
    "likesCount": "increased" | "decreased"
  }
  ```
- **Behavior**:
  - If user hasn't liked: adds like and increments count
  - If user already liked: removes like and decrements count

### 5. Check Comment Like Status

- **GET** `/api/projects/comments/{commentId}/liked?userEmail={userEmail}`
- **Response**: `{ "hasLiked": true/false }`

## Frontend Features

The frontend components now:

- Show filled heart icons for liked comments
- Show empty heart icons for unliked comments
- Update like counts in real-time without page refresh
- Display appropriate toast messages for like/unlike actions
- Maintain like state across comment replies
- **Allow users to edit their own comments and replies**
- **Show edit buttons only for comments authored by the current user**
- **Provide inline editing with save/cancel options**
- **Update comment content immediately in the UI after editing**

## Edit Functionality

### User Experience

- Edit buttons appear only for comments/replies authored by the current user
- Clicking edit transforms the comment content into an editable textarea
- Users can modify the text and save changes or cancel the edit
- The UI updates immediately to reflect changes
- Toast notifications confirm successful edits

### Security

- Backend validates that only the original author can edit a comment
- Frontend shows edit options only for user's own content
- Edit requests include author verification

### Technical Implementation

- Uses optimistic UI updates for immediate feedback
- Maintains edit state separately from comment display state
- Handles both top-level comments and nested replies
- Preserves all other comment metadata during edits
