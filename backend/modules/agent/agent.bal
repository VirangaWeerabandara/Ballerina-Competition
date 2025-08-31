import ballerinax/ai.openai;


configurable string chatGPTApiKey = ?;


public function getChatbotResponse(string message) returns string|error {
    openai:ModelProvider model = check new (chatGPTApiKey,"gpt-4o-mini");

    string answer = check model->generate(`You are an expert backend engineer 
        and you are given a user message and you need to answer 
        it based on the category. The user's message is: ${message}`);

    return answer;
}

