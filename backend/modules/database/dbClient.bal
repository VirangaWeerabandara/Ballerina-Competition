import ballerina/sql;
import ballerinax/postgresql;
import ballerina/log;

configurable string host = ?;
configurable int port = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

public client class DbClient {
    private final postgresql:Client dbClient;
    
    public isolated function init() returns error? {
        sql:ConnectionPool connectionPool = {
            maxOpenConnections: 5,
            maxConnectionLifeTime: 30
        };
        
        self.dbClient = check new postgresql:Client(
            host = host,
            port = port,
            username = user,
            password = password,
            database = database,
            connectionPool = connectionPool
        );
        
        log:printInfo("PostgreSQL database client initialized successfully.");
    }
    
    public isolated function getClient() returns postgresql:Client {
        return self.dbClient;
    }
    
    public isolated function close() returns error? {
        check self.dbClient.close();
        log:printInfo("Database connection closed.");
    }
}

public final DbClient dbClient = check new DbClient();


