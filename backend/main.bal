import ballerina/http;
import ballerina/log;
import ballerina/sql;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

// Database configuration
type DatabaseConfig record {|
    string host;
    int port;
    string username;
    string password;
    string database;
|};

configurable DatabaseConfig databaseConfig = ?;

// Project types enum
enum ProjectType {
    RESTApi,
    GraphQL,
    WebSocket
}

// Project record type
type Project record {|
    string projectId;
    string email;
    string title;
    ProjectType projectType;
    boolean isShared;
    json blockLayout;
|};

// HTTP listener
listener http:Listener httpListener = new (8080);

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Authorization", "Content-Type"],
        allowCredentials: true
    }
}
service /api/projects on httpListener {
    final postgresql:Client dbClient;

    public function init() returns error? {
        self.dbClient = check new (
            databaseConfig.host, 
            databaseConfig.username, 
            databaseConfig.password, 
            databaseConfig.database, 
            databaseConfig.port
        );
        log:printInfo("Successfully connected to the database.");
    }

    // Root endpoint
    resource function get .() returns string {
        return "Welcome to Project Management API!";
    }

    // 1. Get all projects by email
    resource function get byEmail(http:Caller caller, http:Request req) returns error? {
        string? email = req.getQueryParamValue("email");
        
        if email is () {
            check caller->respond({"error": "Email parameter is required"});
            return;
        }

        sql:ParameterizedQuery query = `SELECT projectId, email, title, projectType, isShared, blockLayout 
                                       FROM Project WHERE email = ${email}`;
        
        stream<Project, sql:Error?> resultStream = self.dbClient->query(query, Project);
        
        json[] projects = [];
        
        check from Project project in resultStream
            do {
                projects.push({
                    "projectId": project.projectId,
                    "email": project.email,
                    "title": project.title,
                    "projectType": project.projectType,
                    "isShared": project.isShared,
                    "blockLayout": project.blockLayout
                });
            };

        check caller->respond({
            "message": "Projects fetched successfully",
            "projects": projects
        });

        check  resultStream.close();
    }

    // 2. Get all shared projects (isShared = true)
    resource function get shared() returns json[]|error {
        sql:ParameterizedQuery query = `SELECT projectId, email, title, projectType, isShared, blockLayout 
                                       FROM Project WHERE isShared = true`;
        
        stream<Project, sql:Error?> resultStream = self.dbClient->query(query, Project);
        
        json[] projects = [];
        
        check from Project project in resultStream
            do {
                projects.push({
                    "projectId": project.projectId,
                    "email": project.email,
                    "title": project.title,
                    "projectType": project.projectType,
                    "isShared": project.isShared,
                    "blockLayout": project.blockLayout
                });
            };

        return projects;
    }

    // 3. Create a new project
    resource function post create(http:Caller caller, http:Request req) returns error? {
        json payload;
        var payloadResult = req.getJsonPayload();
        
        if payloadResult is json {
            payload = payloadResult;
        } else {
            check caller->respond({"error": "Invalid JSON payload"});
            return;
        }

        // Extract project details from payload
        string projectId = (check payload.projectId).toString();
        string email = (check payload.email).toString();
        string title = (check payload.title).toString();
        string projectTypeStr = (check payload.projectType).toString();
        boolean isShared = check payload.isShared;
        json blockLayout = check payload.blockLayout;

        // Validate project type
        ProjectType projectType;
        if projectTypeStr == "RESTApi" {
            projectType = RESTApi;
        } else if projectTypeStr == "GraphQL" {
            projectType = GraphQL;
        } else if projectTypeStr == "WebSocket" {
            projectType = WebSocket;
        } else {
            check caller->respond({"error": "Invalid project type. Must be RESTApi, GraphQL, or WebSocket"});
            return;
        }

        // Validate required fields
        if projectId == "" || email == "" || title == "" {
            check caller->respond({"error": "Missing required fields: projectId, email, title"});
            return;
        }

        // Insert project into database
        sql:ParameterizedQuery query = `INSERT INTO Project (projectId, email, title, projectType, isShared, blockLayout)
                                       VALUES (${projectId}, ${email}, ${title}, ${projectTypeStr}::ProjectType, ${isShared}, ${blockLayout.toString()}::jsonb)`;

        var result = self.dbClient->execute(query);

        if result is sql:ExecutionResult {
            log:printInfo("Project created successfully");
            
            json createdProject = {
                "projectId": projectId,
                "email": email,
                "title": title,
                "projectType": projectType,
                "isShared": isShared,
                "blockLayout": blockLayout
            };

            check caller->respond({
                "message": "Project created successfully",
                "project": createdProject
            });
        } else if result is error {
            log:printError("Error occurred while creating project", result);
            check caller->respond({"error": "Failed to create project"});
        }
        
    }

    // 4. Update an existing project
    resource function put update(http:Caller caller, http:Request req) returns error? {
        json payload;
        var payloadResult = req.getJsonPayload();
        
        if payloadResult is json {
            payload = payloadResult;
        } else {
            check caller->respond({"error": "Invalid JSON payload"});
            return;
        }

        // Extract project details from payload
        string projectId = (check payload.projectId).toString();
        string email = (check payload.email).toString();
        string title = (check payload.title).toString();
        string projectTypeStr = (check payload.projectType).toString();
        boolean isShared = check payload.isShared;
        json blockLayout = check payload.blockLayout;

        // Validate project type
        ProjectType projectType;
        if projectTypeStr == "RESTApi" {
            projectType = RESTApi;
        } else if projectTypeStr == "GraphQL" {
            projectType = GraphQL;
        } else if projectTypeStr == "WebSocket" {
            projectType = WebSocket;
        } else {
            check caller->respond({"error": "Invalid project type. Must be RESTApi, GraphQL, or WebSocket"});
            return;
        }

        // Validate required fields
        if projectId == "" {
            check caller->respond({"error": "Project ID is required for update"});
            return;
        }

        // Update project in database
        sql:ParameterizedQuery query = `UPDATE Project 
                                       SET email = ${email}, title = ${title}, projectType = ${projectTypeStr}::ProjectType, 
                                           isShared = ${isShared}, blockLayout = ${blockLayout.toString()}::jsonb
                                       WHERE projectId = ${projectId}`;

        var result = self.dbClient->execute(query);

        if result is sql:ExecutionResult {
            if result.affectedRowCount > 0 {
                log:printInfo("Project updated successfully");
                
                json updatedProject = {
                    "projectId": projectId,
                    "email": email,
                    "title": title,
                    "projectType": projectType,
                    "isShared": isShared,
                    "blockLayout": blockLayout
                };

                check caller->respond({
                    "message": "Project updated successfully",
                    "project": updatedProject
                });
            } else {
                check caller->respond({"error": "Project not found"});
            }
        } else if result is error {
            log:printError("Error occurred while updating project", result);
            check caller->respond({"error": "Failed to update project"});
        }
    }

    // 5. Get projects by project type
    resource function get byType(http:Caller caller, http:Request req) returns error? {
        string? projectTypeParam = req.getQueryParamValue("type");
        
        if projectTypeParam is () {
            check caller->respond({"error": "Project type parameter is required"});
            return;
        }

        // Validate project type
        ProjectType projectType;
        if projectTypeParam == "RESTApi" {
            projectType = RESTApi;
        } else if projectTypeParam == "GraphQL" {
            projectType = GraphQL;
        } else if projectTypeParam == "WebSocket" {
            projectType = WebSocket;
        } else {
            check caller->respond({"error": "Invalid project type. Must be RESTApi, GraphQL, or WebSocket"});
            return;
        }

        sql:ParameterizedQuery query = `SELECT projectId, email, title, projectType, isShared, blockLayout 
                                       FROM Project WHERE projectType = ${projectType}`;
        
        stream<Project, sql:Error?> resultStream = self.dbClient->query(query, Project);
        
        json[] projects = [];
        
        check from Project project in resultStream
            do {
                projects.push({
                    "projectId": project.projectId,
                    "email": project.email,
                    "title": project.title,
                    "projectType": project.projectType,
                    "isShared": project.isShared,
                    "blockLayout": project.blockLayout
                });
            };

        check caller->respond({
            "message": "Projects fetched successfully",
            "projects": projects,
            "projectType": projectType
        });
    }

    // Delete a project (additional utility endpoint)
    resource function delete remove(http:Caller caller, http:Request req) returns error? {
        string? projectId = req.getQueryParamValue("projectId");
        
        if projectId is () {
            check caller->respond({"error": "Project ID parameter is required"});
            return;
        }

        sql:ParameterizedQuery query = `DELETE FROM Project WHERE projectId = ${projectId}`;
        
        var result = self.dbClient->execute(query);

        if result is sql:ExecutionResult {
            if result.affectedRowCount > 0 {
                log:printInfo("Project deleted successfully");
                check caller->respond({"message": "Project deleted successfully"});
            } else {
                check caller->respond({"error": "Project not found"});
            }
        } else if result is error {
            log:printError("Error occurred while deleting project", result);
            check caller->respond({"error": "Failed to delete project"});
        }
    }

    // Get single project by ID (additional utility endpoint)
    resource function get byId(http:Caller caller, http:Request req) returns error? {
        string? projectId = req.getQueryParamValue("projectId");
        
        if projectId is () {
            check caller->respond({"error": "Project ID parameter is required"});
            return;
        }

        sql:ParameterizedQuery query = `SELECT projectId, email, title, projectType, isShared, blockLayout 
                                       FROM Project WHERE projectId = ${projectId} LIMIT 1`;
        
        stream<Project, sql:Error?> resultStream = self.dbClient->query(query, Project);
        
        var result = resultStream.next();
        if result is record {|Project value;|} {
            Project project = result.value;
            json projectJson = {
                "projectId": project.projectId,
                "email": project.email,
                "title": project.title,
                "projectType": project.projectType,
                "isShared": project.isShared,
                "blockLayout": project.blockLayout
            };
            
            check caller->respond({
                "message": "Project fetched successfully",
                "project": projectJson
            });
        } else if result is error {
            log:printError("Error occurred while fetching project", result);
            check caller->respond({"error": "Failed to fetch project"});
        } else {
            check caller->respond({"error": "Project not found"});
        }

        check resultStream.close();
    }

    
}

// Main service for health check
service / on httpListener {
    resource function get .() returns string {
        return "Project Management API is running!";
    }
}