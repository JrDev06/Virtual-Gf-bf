const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

const OPENAI_API_KEY = 'sk-proj-9fkDmZUOrhzZFqB9TbBnT3BlbkFJDc8jKpVePiz0CF0Nt7Hs';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/engines/davinci-codex/completions';

app.use(bodyParser.json());

// Schedule greetings using node-cron (every morning at 9 AM)
cron.schedule('0 9 * * *', async () => {
    try {
        const greeting = generateGreeting();
        const response = await axios.post(OPENAI_ENDPOINT, {
            prompt: greeting,
            max_tokens: 50,
            stop: ['\n', 'Tao:'],
            api_key: OPENAI_API_KEY
        });

        const botMessage = response.data.choices[0].text.trim();
        console.log(`Scheduled greeting: ${botMessage}`);
        // Optionally, you can send this message to a user via a messaging service like Twilio or Telegram
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error.message);
    }
});

// Function to generate random greetings
function generateGreeting() {
    const greetings = [
        "Magandang umaga, mahal ko! Kumusta ang tulog mo?",
        "Hi love! May bagong araw na naman. Alam mo bang naiisip kita agad pag-gising ko?",
        "Good morning, love! Sana magkasama tayo ngayong araw.",
        "Hey, love! Nais ko lang sabihing napakaswerte ko at ikaw ang mahal ko."
    ];
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

// Handle incoming messages
app.post('/api/message', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(OPENAI_ENDPOINT, {
            prompt: message,
            max_tokens: 50,
            stop: ['\n', 'Tao:'],
            api_key: OPENAI_API_KEY
        });

        const botMessage = response.data.choices[0].text.trim();
        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error.message);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
