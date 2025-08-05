import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;
import ballerina/log;

configurable string dbHost = "localhost";
configurable int dbPort = 5432;
configurable string dbUsername = "postgres";
configurable string dbPassword = ?;
configurable string dbName = "postgres";

public function getDatabaseConnection() returns postgresql:Client|error {
    log:printInfo("Attempting to connect to PostgreSQL...");
    
    postgresql:Client|error dbClient = new ({
        host: dbHost,
        port: dbPort,
        username: dbUsername,
        password: dbPassword,
        database: dbName
    });

    if dbClient is error {
        log:printError("Failed to connect to PostgreSQL", 'error = dbClient);
        return dbClient;
    }

    log:printInfo("Successfully connected to PostgreSQL");
    return dbClient;
}

public function testDatabaseConnection() returns boolean {
    postgresql:Client|error dbClient = getDatabaseConnection();
    
    if dbClient is error {
        log:printError("Database connection test failed", 'error = dbClient);
        return false;
    }
    
    // Test with a simple query
    var result = dbClient->execute(`SELECT 1 as test`);
    if result is error {
        log:printError("Database query test failed", 'error = result);
        return false;
    }
    
    log:printInfo("Database connection test successful");
    return true;
}