CREATE TYPE ProjectType AS ENUM ('RESTApi', 'GraphQL', 'WebSocket');

CREATE TABLE Project (
    projectId VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    projectType ProjectType NOT NULL,
    isShared BOOLEAN NOT NULL,
    blockLayout JSONB
);