-- Database Population Script for Project Management API
-- This script inserts sample data into the Project table

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM Project;

-- Insert sample projects for different users and project types

-- User 1: john.doe@example.com - REST API Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_001', 'john.doe@example.com', 'E-commerce API', 'RESTApi', true, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /products"}, {"id": "2", "type": "endpoint", "name": "POST /orders"}]}'),
('proj_002', 'john.doe@example.com', 'User Management System', 'RESTApi', false, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /users"}, {"id": "2", "type": "endpoint", "name": "PUT /users/{id}"}]}'),
('proj_003', 'john.doe@example.com', 'Payment Gateway API', 'RESTApi', true, '{"blocks": [{"id": "1", "type": "endpoint", "name": "POST /payments"}, {"id": "2", "type": "endpoint", "name": "GET /transactions"}]}');

-- User 2: jane.smith@example.com - GraphQL Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_004', 'jane.smith@example.com', 'Social Media GraphQL', 'GraphQL', true, '{"blocks": [{"id": "1", "type": "query", "name": "getUserPosts"}, {"id": "2", "type": "mutation", "name": "createPost"}]}'),
('proj_005', 'jane.smith@example.com', 'Blog Platform', 'GraphQL', false, '{"blocks": [{"id": "1", "type": "query", "name": "getArticles"}, {"id": "2", "type": "mutation", "name": "updateArticle"}]}'),
('proj_006', 'jane.smith@example.com', 'Task Management System', 'GraphQL', true, '{"blocks": [{"id": "1", "type": "query", "name": "getTasks"}, {"id": "2", "type": "subscription", "name": "taskUpdates"}]}');

-- User 3: mike.johnson@example.com - WebSocket Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_007', 'mike.johnson@example.com', 'Real-time Chat App', 'WebSocket', true, '{"blocks": [{"id": "1", "type": "connection", "name": "chatConnection"}, {"id": "2", "type": "event", "name": "messageReceived"}]}'),
('proj_008', 'mike.johnson@example.com', 'Live Dashboard', 'WebSocket', false, '{"blocks": [{"id": "1", "type": "connection", "name": "dataStream"}, {"id": "2", "type": "event", "name": "metricsUpdate"}]}'),
('proj_009', 'mike.johnson@example.com', 'Collaborative Editor', 'WebSocket', true, '{"blocks": [{"id": "1", "type": "connection", "name": "documentSync"}, {"id": "2", "type": "event", "name": "cursorPosition"}]}');

-- User 4: sarah.wilson@example.com - Mixed Project Types
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_010', 'sarah.wilson@example.com', 'Full-Stack E-commerce', 'RESTApi', true, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /products"}, {"id": "2", "type": "endpoint", "name": "POST /checkout"}]}'),
('proj_011', 'sarah.wilson@example.com', 'Analytics Dashboard', 'GraphQL', false, '{"blocks": [{"id": "1", "type": "query", "name": "getMetrics"}, {"id": "2", "type": "mutation", "name": "updateSettings"}]}'),
('proj_012', 'sarah.wilson@example.com', 'Notification Service', 'WebSocket', true, '{"blocks": [{"id": "1", "type": "connection", "name": "notificationStream"}, {"id": "2", "type": "event", "name": "newNotification"}]}');

-- User 5: alex.chen@example.com - Developer Portfolio Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_013', 'alex.chen@example.com', 'Portfolio API', 'RESTApi', true, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /projects"}, {"id": "2", "type": "endpoint", "name": "GET /skills"}]}'),
('proj_014', 'alex.chen@example.com', 'Learning Management System', 'GraphQL', true, '{"blocks": [{"id": "1", "type": "query", "name": "getCourses"}, {"id": "2", "type": "mutation", "name": "enrollCourse"}]}'),
('proj_015', 'alex.chen@example.com', 'Code Review Tool', 'WebSocket', false, '{"blocks": [{"id": "1", "type": "connection", "name": "reviewSession"}, {"id": "2", "type": "event", "name": "commentAdded"}]}');

-- User 6: emma.davis@example.com - Enterprise Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_016', 'emma.davis@example.com', 'HR Management API', 'RESTApi', false, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /employees"}, {"id": "2", "type": "endpoint", "name": "POST /attendance"}]}'),
('proj_017', 'emma.davis@example.com', 'Inventory System', 'GraphQL', true, '{"blocks": [{"id": "1", "type": "query", "name": "getInventory"}, {"id": "2", "type": "mutation", "name": "updateStock"}]}'),
('proj_018', 'emma.davis@example.com', 'Real-time Monitoring', 'WebSocket', true, '{"blocks": [{"id": "1", "type": "connection", "name": "monitoringFeed"}, {"id": "2", "type": "event", "name": "alertTriggered"}]}');

-- User 7: david.brown@example.com - Startup Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_019', 'david.brown@example.com', 'Food Delivery API', 'RESTApi', true, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /restaurants"}, {"id": "2", "type": "endpoint", "name": "POST /orders"}]}'),
('proj_020', 'david.brown@example.com', 'Fitness Tracker', 'GraphQL', false, '{"blocks": [{"id": "1", "type": "query", "name": "getWorkouts"}, {"id": "2", "type": "mutation", "name": "logExercise"}]}'),
('proj_021', 'david.brown@example.com', 'Live Streaming Platform', 'WebSocket', true, '{"blocks": [{"id": "1", "type": "connection", "name": "streamConnection"}, {"id": "2", "type": "event", "name": "viewerJoined"}]}');

-- User 8: lisa.garcia@example.com - Educational Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_022', 'lisa.garcia@example.com', 'Student Portal API', 'RESTApi', true, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /courses"}, {"id": "2", "type": "endpoint", "name": "GET /grades"}]}'),
('proj_023', 'lisa.garcia@example.com', 'Online Quiz System', 'GraphQL', true, '{"blocks": [{"id": "1", "type": "query", "name": "getQuestions"}, {"id": "2", "type": "mutation", "name": "submitAnswer"}]}'),
('proj_024', 'lisa.garcia@example.com', 'Virtual Classroom', 'WebSocket', false, '{"blocks": [{"id": "1", "type": "connection", "name": "classroomSession"}, {"id": "2", "type": "event", "name": "studentJoined"}]}');

-- User 9: tom.anderson@example.com - Gaming Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_025', 'tom.anderson@example.com', 'Game Leaderboard API', 'RESTApi', true, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /leaderboard"}, {"id": "2", "type": "endpoint", "name": "POST /score"}]}'),
('proj_026', 'tom.anderson@example.com', 'Player Profile System', 'GraphQL', false, '{"blocks": [{"id": "1", "type": "query", "name": "getPlayerStats"}, {"id": "2", "type": "mutation", "name": "updateProfile"}]}'),
('proj_027', 'tom.anderson@example.com', 'Multiplayer Game Server', 'WebSocket', true, '{"blocks": [{"id": "1", "type": "connection", "name": "gameSession"}, {"id": "2", "type": "event", "name": "playerMove"}]}');

-- User 10: rachel.martinez@example.com - Healthcare Projects
INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout) VALUES
('proj_028', 'rachel.martinez@example.com', 'Patient Records API', 'RESTApi', false, '{"blocks": [{"id": "1", "type": "endpoint", "name": "GET /patients"}, {"id": "2", "type": "endpoint", "name": "POST /appointments"}]}'),
('proj_029', 'rachel.martinez@example.com', 'Medical Device Interface', 'GraphQL', true, '{"blocks": [{"id": "1", "type": "query", "name": "getDeviceData"}, {"id": "2", "type": "mutation", "name": "updateSettings"}]}'),
('proj_030', 'rachel.martinez@example.com', 'Emergency Alert System', 'WebSocket', true, '{"blocks": [{"id": "1", "type": "connection", "name": "alertChannel"}, {"id": "2", "type": "event", "name": "emergencyAlert"}]}');

-- Display summary of inserted data
SELECT 
    projectType,
    COUNT(*) as project_count,
    COUNT(CASE WHEN isShared = true THEN 1 END) as shared_count,
    COUNT(CASE WHEN isShared = false THEN 1 END) as private_count
FROM Project 
GROUP BY projectType 
ORDER BY projectType;

-- Display user project counts
SELECT 
    email,
    COUNT(*) as total_projects,
    COUNT(CASE WHEN projectType = 'RESTApi' THEN 1 END) as rest_api_count,
    COUNT(CASE WHEN projectType = 'GraphQL' THEN 1 END) as graphql_count,
    COUNT(CASE WHEN projectType = 'WebSocket' THEN 1 END) as websocket_count
FROM Project 
GROUP BY email 
ORDER BY total_projects DESC;
