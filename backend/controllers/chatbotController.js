import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


export const chatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/google/flan-t5-large",
            { inputs: message },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        let reply = response.data[0]?.generated_text || "Sorry, I couldn't generate a response.";

        return res.json({ success: true, reply });
    } catch (error) {
        console.error("Chatbot Error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

