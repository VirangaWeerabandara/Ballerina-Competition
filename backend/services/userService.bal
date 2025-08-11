// import ballerina/http;
// import ballerina/uuid;
// import ballerina/log;
// import ballerina/sql;
// import backend.modules.models;
// import backend.database;

// service /users on new http:Listener(9090) {
    
//     // Resource for user registration (Create User)
//     resource function post .(@http:Payload models:User newUser) returns http:Created|http:InternalServerError {
//         log:printInfo("Received request to create new user: " + newUser.email);
        
//         string userId = uuid:createType4AsString();
        
//         // Create a new user record with the generated ID
//         models:User userToInsert = {
//             userId: userId,
//             firstName: newUser.firstName,
//             lastName: newUser.lastName,
//             email: newUser.email,
//             password: newUser.password,
//             phoneNumber: newUser.phoneNumber
//         };
        
//         // In a real application, hash the password before storing
//         // userToInsert.password = hashPassword(userToInsert.password);
        
//         string insertQuery = string `INSERT INTO users (user_id, first_name, last_name, email, password, phone_number) 
//                                    VALUES (${userToInsert.userId}, ${userToInsert.firstName}, ${userToInsert.lastName}, 
//                                           ${userToInsert.email}, ${userToInsert.password}, ${userToInsert.phoneNumber})`;
        
//         sql:ExecutionResult|error result = database:dbClient.getClient()->execute(insertQuery);
        
//         if (result is error) {
//             log:printError("Error inserting user: " + result.message());
//             return <http:InternalServerError>{ body: "Failed to create user." };
//         }
        
//         log:printInfo("User created successfully: " + userId);
//         return <http:Created>{ body: userToInsert };
//     }
    
//     // Resource to get user by ID (Read User)
//     resource function get [string userId]() returns models:User|http:NotFound|http:InternalServerError {
//         log:printInfo("Received request to get user by ID: " + userId);
        
//         string selectQuery = string `SELECT user_id, first_name, last_name, email, phone_number 
//                                    FROM users WHERE user_id = ${userId}`;
        
//         stream<record{}, error?>|error result = database:dbClient.getClient()->query(selectQuery);
        
//         if (result is error) {
//             log:printError("Error querying user: " + result.message());
//             return <http:InternalServerError>{ body: "Failed to retrieve user." };
//         }
        
//         record{}|error? userRow = result.next();
//         error? closeResult = result.close();
//         if (closeResult is error) {
//             log:printError("Error closing result stream: " + closeResult.message());
//         }
        
//         if (userRow is () || userRow is error) {
//             log:printWarn("User not found: " + userId);
//             return <http:NotFound>{ body: "User not found." };
//         }
        
//         models:User user = {
//             userId: <string>userRow["user_id"],
//             firstName: <string>userRow["first_name"],
//             lastName: <string>userRow["last_name"],
//             email: <string>userRow["email"],
//             password: "", // Password should not be returned
//             phoneNumber: <string>userRow["phone_number"]
//         };
        
//         log:printInfo("User retrieved successfully: " + userId);
//         return user;
//     }
    
//     // Resource to update user details (Update User)
//     resource function put [string userId](@http:Payload models:User updatedUser) returns http:Ok|http:NotFound|http:InternalServerError {
//         log:printInfo("Received request to update user: " + userId);
        
//         string updateQuery = string `UPDATE users SET first_name = ${updatedUser.firstName}, 
//                                    last_name = ${updatedUser.lastName}, email = ${updatedUser.email}, 
//                                    phone_number = ${updatedUser.phoneNumber} WHERE user_id = ${userId}`;
        
//         sql:ExecutionResult|error result = database:dbClient.getClient()->execute(updateQuery);
        
//         if (result is error) {
//             log:printError("Error updating user: " + result.message());
//             return <http:InternalServerError>{ body: "Failed to update user." };
//         }
        
//         if (result.affectedRowCount == 0) {
//             log:printWarn("User not found for update: " + userId);
//             return <http:NotFound>{ body: "User not found." };
//         }
        
//         models:User responseUser = {
//             userId: userId,
//             firstName: updatedUser.firstName,
//             lastName: updatedUser.lastName,
//             email: updatedUser.email,
//             password: "",
//             phoneNumber: updatedUser.phoneNumber
//         };
        
//         log:printInfo("User updated successfully: " + userId);
//         return <http:Ok>{ body: responseUser };
//     }
    
//     // Resource to delete a user (Delete User)
//     resource function delete [string userId]() returns http:NoContent|http:NotFound|http:InternalServerError {
//         log:printInfo("Received request to delete user: " + userId);
        
//         string deleteQuery = string `DELETE FROM users WHERE user_id = ${userId}`;
        
//         sql:ExecutionResult|error result = database:dbClient.getClient()->execute(deleteQuery);
        
//         if (result is error) {
//             log:printError("Error deleting user: " + result.message());
//             return <http:InternalServerError>{ body: "Failed to delete user." };
//         }
        
//         if (result.affectedRowCount == 0) {
//             log:printWarn("User not found for deletion: " + userId);
//             return <http:NotFound>{ body: "User not found." };
//         }
        
//         log:printInfo("User deleted successfully: " + userId);
//         return <http:NoContent>{};
//     }
    
//     // Resource for user login (Authentication)
//     resource function post /login(@http:Payload json credentials) returns http:Ok|http:Unauthorized|http:InternalServerError {
//         json emailField = credentials.email;
//         json passwordField = credentials.password;
        
//         if (emailField is () || passwordField is ()) {
//             return <http:Unauthorized>{ body: "Invalid credentials format." };
//         }
        
//         string email = emailField.toString();
//         string password = passwordField.toString();
        
//         log:printInfo("Received login request for email: " + email);
        
//         string selectQuery = string `SELECT user_id, password FROM users WHERE email = ${email}`;
        
//         stream<record{}, error?>|error result = database:dbClient.getClient()->query(selectQuery);
        
//         if (result is error) {
//             log:printError("Error during login query: " + result.message());
//             return <http:InternalServerError>{ body: "Login failed." };
//         }
        
//         record{}|error? userRow = result.next();
//         error? closeResult = result.close();
//         if (closeResult is error) {
//             log:printError("Error closing result stream: " + closeResult.message());
//         }
        
//         if (userRow is () || userRow is error) {
//             log:printWarn("Login failed: User not found for email " + email);
//             return <http:Unauthorized>{ body: "Invalid credentials." };
//         }
        
//         string storedHashedPassword = <string>userRow["password"];
        
//         // In a real application, compare hashed passwords
//         // For demonstration, direct comparison (DO NOT use in production)
//         if (password != storedHashedPassword) {
//             log:printWarn("Login failed: Incorrect password for email " + email);
//             return <http:Unauthorized>{ body: "Invalid credentials." };
//         }
        
//         string userId = <string>userRow["user_id"];
        
//         // Generate JWT token here and return it
//         string token = "mock_jwt_token_for_" + userId;
        
//         log:printInfo("User logged in successfully: " + userId);
//         return <http:Ok>{ body: { "token": token, "userId": userId } };
//     }
// }