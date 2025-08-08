import ballerina/io;
import backend.database;

public function main() returns error? {
    io:println("Starting application...");
    
    // The database connection is automatically established when the module is imported
    // because of the `public final DbClient dbClient = check new DbClient();` line in dbClient.bal
    
    // Get the actual PostgreSQL client from your DbClient wrapper
    var dbClient = database:dbClient.getClient();
    io:println("Database client obtained successfully!");
    
    // You can now use the client for database operations
    // Example: Execute a simple query to test connection
    stream<record {| int test_connection; |}, error?> resultStream = dbClient->query(`SELECT 1 as test_connection`);
    record {| int test_connection; |}[] result = check from var row in resultStream
        select row;
    if result.length() > 0 {
        io:println("Database connection test successful!");
        // Optionally, you can iterate through the result to see the data
        foreach var row in result {
            io:println("Test result: ", row);
        }
    }
    
    io:println("Application started successfully!");
    
    // Don't forget to close the connection when the application shuts down
    check database:dbClient.close();
}