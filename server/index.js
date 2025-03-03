import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { storyRouter } from "./routes/storyRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/stories", storyRouter);

// Generate story endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, genre, length } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a creative storyteller. Create a ${
              genre || "fantasy"
            } story that is ${
              length || "medium"
            } in length. The story should be well-structured with a beginning, middle, and end.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: length === "short" ? 500 : length === "long" ? 2000 : 1000,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const story = response.data.choices[0].message.content;
    res.json({ story });
  } catch (error) {
    console.error(
      "Error generating story:",
      error.response ? error.response.data : error.message
    );
    if (error.response) {
      if (error.response.status === 401) {
        res.status(401).json({
          error:
            "Invalid OpenRouter API key. Please check your key and try again.",
        });
      } else if (error.response.status === 404) {
        res.status(404).json({
          error: "Model not found on OpenRouter. Try a different model.",
        });
      } else if (error.response.status === 429) {
        res
          .status(429)
          .json({ error: "Rate limit exceeded. Please wait and try again." });
      } else {
        res.status(500).json({
          error: "Failed to generate story: " + error.response.data.message,
        });
      }
    } else {
      res
        .status(500)
        .json({ error: "Failed to generate story: " + error.message });
    }
  }
});

// Root route handler
app.get("/", (req, res) => {
  res.json({ message: "AI Story Generator API is running" });
});

// Catch-all route handler for any undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
