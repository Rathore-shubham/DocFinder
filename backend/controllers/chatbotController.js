import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const chatbotResponse = async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.cohere.ai/v1/generate",
            {
                model: "command",
                prompt: message,
                max_tokens: 100,
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ reply: response.data.generations[0].text });
    } catch (error) {
        console.error("Cohere API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch response from Cohere API" });
    }
};
