import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ HTTP server running on port ${process.env.PORT || 3000}`);
});

const wss = new WebSocketServer({ server });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

wss.on("connection", (ws) => {
  console.log("⚡ New client connected");
  ws.send(JSON.stringify({ type: "status", data: "connected" }));

  ws.on("message", async (message) => {
    const { type, data } = JSON.parse(message);

    if (type === "user_message") {
      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: data }],
          stream: true,
        });

        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content || "";
          if (token) ws.send(JSON.stringify({ type: "bot_chunk", data: token }));
        }

        ws.send(JSON.stringify({ type: "bot_done" }));
      } catch (err) {
        console.error("❌ Error:", err);
        ws.send(JSON.stringify({ type: "error", data: err.message }));
      }
    }
  });

  ws.on("close", () => console.log("🔌 Client disconnected"));
});
