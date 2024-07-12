const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = 'j86bwkwo-8hako-12C';
const chatbotEndpoint = 'https://liaspark.chatbotcommunity.ltd/@lanceajiro/api/jea';

app.use(bodyParser.json());

// Schedule greetings using node-cron (every morning at 9 AM)
cron.schedule('0 9 * * *', async () => {
    try {
        const greeting = generateGreeting();
        const response = await axios.get(chatbotEndpoint, {
            params: {
                key: apiKey,
                query: greeting
            }
        });

        const botMessage = translateToTagalog(response.data.message);
        console.log(`Scheduled greeting: ${botMessage}`);
        // Optionally, you can send this message to a user via a messaging service like Twilio or Telegram
    } catch (error) {
        console.error('Error fetching response from chatbot API:', error.message);
    }
});

// Function to generate random greetings
function generateGreeting() {
    const greetings = [
        "Hello who are you?",
        "Hi, how are you?",
        "Good morning!",
        "Hey there!"
    ];
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

// Function to translate responses to Tagalog
function translateToTagalog(message) {
    // Implement your translation logic here
    // For demonstration purposes, let's assume a simple translation
    // Replace this with your actual translation implementation
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
            return message; // Return original message if no translation is specified
    }
}

// Handle incoming messages
app.get('/api/ask=:question', async (req, res) => {
    const { question } = req.params;

    try {
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
