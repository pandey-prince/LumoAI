import express from "express";
import Thread from "../models/Thread.js";
import { getOpenAIAPIResponse } from "../utils/openai.js";

const router = express.Router();

// 🧪 Test route (optional)
router.post("/text", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "Testing new thread",
    });

    const response = await thread.save();
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save the data" });
  }
});

// 🧩 Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// 🧩 Get a specific thread by ID
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.error("Failed to fetch chat:", err);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

// 🧹 Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json({ success: true, message: "Thread deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// 💬 Chat route
router.post("/chat", async (req, res) => {
  try {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let thread = await Thread.findOne({ threadId });

    // 🧠 If no thread, create one
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.slice(0, 40), // first few words as title
        messages: [{ role: "user", content: message }],
      });
  } else {
      thread.messages.push({ role: "user", content: message });
    }

    // 🧠 Get assistant response
    const assistantReply = await getOpenAIAPIResponse(message);

    // Push assistant message
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
