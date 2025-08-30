CREATE TYPE ProjectType AS ENUM ('RESTApi', 'GraphQL', 'WebSocket');

CREATE TABLE Project (
    projectId VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    projectType ProjectType NOT NULL,
    isShared BOOLEAN NOT NULL,
    blockLayout JSONB
);

CREATE TABLE Comment (
    commentId VARCHAR(255) PRIMARY KEY,
    projectId VARCHAR(255) NOT NULL REFERENCES Project(projectId) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    parentCommentId VARCHAR(255) NULL REFERENCES Comment(commentId) ON DELETE CASCADE,
    likesCount INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
