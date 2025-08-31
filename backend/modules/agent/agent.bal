// modules/agent/agent.bal

import ballerina/http;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.openai;

// Define a configurable variable for the OpenAI API key
// It's recommended to load this from a Config.toml file or environment variables
configurable string openAIApiKey = ?;

// Define the structure for a chat message, as expected by the OpenAI API
// This is a generic structure for AI chat models
public type ChatMessage record {
    string role;
    string content;
};

// Function to interact with the AI model
// It takes the user's message and returns the chatbot's response
public function getChatbotResponse(string userMessage) returns string|error {
    log:printInfo("Received user message: " + userMessage);

    // Initialize the OpenAI model provider with the API key and desired model
    // Using GPT_4O as an example, you can change this to other models like GPT_3_5_TURBO
    // The `ballerinax/ai.openai` connector provides specific model constants.
    final ai:ModelProvider openAiModel = check new openai:ModelProvider(openAIApiKey, openai:GPT_4O);

    // Construct the messages array for the AI model request
    // You can add more messages here for conversation history to maintain context
    ChatMessage[] messages = [
        {role: "system", content: "You are a helpful assistant that teaches about backend services like REST API, GraphQL, and WebSockets."},
        {role: "user", content: userMessage}
    ];

    // Use Ballerina's natural expression to call the LLM
    // The `natural` expression is part of the `ballerina/ai` module and simplifies LLM interaction.
    // The response will be automatically bound to a string or a structured type if defined.
    string|error llmResponse = natural (openAiModel) {
        messages
    };

    if llmResponse is string {
        log:printInfo("Chatbot reply: " + llmResponse);
        return llmResponse;
    } else {
        log:printError("Error calling LLM: " + llmResponse.message());
        return error("Failed to get response from chatbot: " + llmResponse.message());
    }
}