import ballerina/websocket;
import ballerina/log;
import ballerina/uuid;

// WebSocket service for real-time communication
service class WebSocketService {
    *websocket:Service;
    
    private string connectionId = "";
    
    function init() {
        self.connectionId = uuid:createType4AsString();
        log:printInfo("WebSocket connection established: " + self.connectionId);
    }
    
    // Handle incoming messages
    remote function onTextMessage(websocket:Caller caller, string message) returns error? {
        log:printInfo("Received message: " + message);
        
        // Echo back the message for now
        check caller->writeTextMessage("Echo: " + message);
    }
    
    // Handle connection close
    remote function onClose(websocket:Caller caller) returns error? {
        log:printInfo("WebSocket connection closed: " + self.connectionId);
    }
    
    // Handle connection errors
    remote function onError(websocket:Caller caller, error err) returns error? {
        log:printError("WebSocket error: " + err.message());
    }
}

// WebSocket service endpoint
service /ws on new websocket:Listener(9091) {
    resource function get .() returns websocket:Service {
        return new WebSocketService();
    }
}

// Configuration
configurable int websocketPort = 9091;
