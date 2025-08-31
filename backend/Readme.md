# Backend Setup & Running Instructions

This document provides step-by-step instructions to set up and run the OneBlock backend service.

## Prerequisites

- **Ballerina**: 2201.12.7 or later
- **PostgreSQL**: 12+ with JSONB support
- **OpenAI API Key**: For chatbot functionality (optional but recommended)

## Installation Steps

### 1. Install Ballerina

```bash
# Download and install Ballerina from https://ballerina.io/downloads/
# Verify installation
bal --version
```

### 2. Configure Environment

```bash
# Copy example config
cp Config.example.toml Config.toml

# Edit Config.toml with your values:
# - Add your OpenAI API key (for chatbot functionality)
# - Configure database connection details
```

### 3. Database Setup

#### Create Database and Tables

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE oneblok_db;

-- Connect to the database
\c oneblok_db

-- Create ProjectType enum
CREATE TYPE ProjectType AS ENUM ('RESTApi', 'GraphQL', 'WebSocket');

-- Create Project table
CREATE TABLE Project (
    projectId VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    projectType ProjectType NOT NULL,
    isShared BOOLEAN DEFAULT false,
    blockLayout JSONB NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Comment table
CREATE TABLE Comment (
    commentId VARCHAR(255) PRIMARY KEY,
    projectId VARCHAR(255) NOT NULL REFERENCES Project(projectId) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    parentCommentId VARCHAR(255) REFERENCES Comment(commentId) ON DELETE CASCADE,
    likesCount INTEGER DEFAULT 0,
    createdAt VARCHAR(255) NOT NULL
);

-- Create CommentLike table
CREATE TABLE CommentLike (
    commentId VARCHAR(255) NOT NULL REFERENCES Comment(commentId) ON DELETE CASCADE,
    userEmail VARCHAR(255) NOT NULL,
    createdAt VARCHAR(255) NOT NULL,
    PRIMARY KEY (commentId, userEmail)
);

-- Create indexes for better performance
CREATE INDEX idx_project_email ON Project(email);
CREATE INDEX idx_project_type ON Project(projectType);
CREATE INDEX idx_comment_project ON Comment(projectId);
CREATE INDEX idx_comment_author ON Comment(author);
```

### 4. Configuration File

Create a `Config.toml` file in the backend directory with the following structure:

```toml
[backend.agent]
chatGPTApiKey = "your_openai_api_key_here"

[databaseConfig]
host = "localhost"
port = 5432
username = "your_postgres_username"
password = "your_postgres_password"
database = "your_database_name"
```

#### Configuration Details

- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Database**: Use the database name you created (e.g., `oneblok_db`)
- **Host**: Usually `localhost` for local development
- **Port**: Default PostgreSQL port is `5432`

## Running the Backend

### 1. Build the Project

```bash
# Navigate to backend directory
cd backend

# Build the project
bal build
```

### 2. Start the Service

```bash
# Run the service
bal run

# The API will be available at http://localhost:8080
```

### 3. Verify Installation

```bash
# Test backend health
curl http://localhost:8080/
# Should return: "Project Management API is running!"

# Test API root
curl http://localhost:8080/api/projects
# Should return: "Welcome to Project Management API!"
```

## Troubleshooting

### Common Issues

#### Database Connection Failed

- Verify PostgreSQL is running
- Check database credentials in `Config.toml`
- Ensure database exists and tables are created

#### Port Already in Use

- Change port in `main.bal` if 8080 is occupied
- Update CORS configuration accordingly

#### Build Errors

- Ensure Ballerina version is 2201.12.7+
- Check all dependencies are properly installed
- Verify `Config.toml` is properly formatted

### Debug Mode

```bash
# Run with debug logging
bal run --debug
```

## Next Steps

After successfully running the backend:

1. **Frontend Setup**: Navigate to the `frontend/` directory and follow the setup instructions in `frontend/README.md`
2. **Testing**: Use the frontend application to test the backend API endpoints
3. **Development**: Make changes to the backend code and restart the service

## Support

If you encounter any issues, please contact: **virangaweerabandara@gmail.com**
