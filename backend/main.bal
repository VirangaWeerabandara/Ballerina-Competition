import ballerina/io;
import backend.database;

public function main() returns error? {
    io:println("Starting application...");
    
    // Get the actual PostgreSQL client from your DbClient wrapper
    var dbClient = database:dbClient.getClient();
    io:println("Database client obtained successfully!");
    
    // Test database connection
    stream<record {| int test_connection; |}, error?> resultStream = dbClient->query(`SELECT 1 as test_connection`);
    record {| int test_connection; |}[] result = check from var row in resultStream
        select row;
    if result.length() > 0 {
        io:println("Database connection test successful!");
        foreach var row in result {
            io:println("Test result: ", row);
        }
    }
    
    io:println("Application started successfully!");
    io:println("WebSocket service is available at ws://localhost:9091/ws");
    
    // Keep the application running
    io:readln("Press enter to exit...");
    
    // Don't forget to close the connection when the application shuts down
    check database:dbClient.close();
}
