const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = 'j86bwkwo-8hako-12C';
const chatbotEndpoint = 'https://liaspark.chatbotcommunity.ltd/@lanceajiro/api/jea'; // Update with actual endpoint

app.use(bodyParser.json());

let conversationHistory = {}; // Object to store conversation history by user ID

// Function to translate responses to Tagalog (sample translation)
function translateToTagalog(message) {
    switch (message.toLowerCase()) {
        case "hello, who are you?":
            return "Kamusta, sino ka?";
        case "hi, how are you?":
            return "Hi, kamusta ka?";
        case "good morning!":
            return "Magandang umaga!";
        case "hey there!":
            return "Kamusta!";
        default:
            return message;
    }
}

// Handle incoming messages
app.get('/api/ask=:question', async (req, res) => {
    const { question } = req.params;

    try {
        // Simulate conversation with external API
        const response = await axios.get(chatbotEndpoint, {
            params: {
                key: apiKey,
                query: question
            }
        });

        const botMessage = translateToTagalog(response.data.message);
        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error fetching response from chatbot API:', error.message);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// Handle all other requests (404 - Not Found)
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
