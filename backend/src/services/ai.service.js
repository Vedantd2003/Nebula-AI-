import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import logger from "../utils/logger.js";

class AIService {
  constructor() {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is missing in .env");
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  // ===============================
  // 🔹 CORE TEXT GENERATION
  // ===============================
  async generateText(prompt, options = {}) {
    try {
      const {
        model = "mistralai/mistral-7b-instruct",
        maxTokens = 1000,
        temperature = 0.7,
        systemPrompt = "You are a helpful AI assistant."
      } = options;

      const completion = await this.openai.chat.completions.create({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      });

      const text = completion?.choices?.[0]?.message?.content || "";

      return {
        text,
        metadata: {
          model,
          usage: completion.usage || {}
        }
      };

    } catch (error) {
      logger.error("AI text generation error:", error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  // ===============================
  // 🔹 CREATIVE CONTENT
  // ===============================
  async generateCreativeContent(prompt, contentType = "article") {
    try {
      const systemPrompts = {
        article: "You are a professional content writer. Create engaging, well-structured articles.",
        blog: "You are a creative blogger. Write in a conversational, engaging tone.",
        social: "You are a social media expert. Create concise, engaging content optimized for social platforms.",
        email: "You are a professional email writer. Create clear, effective email content.",
        story: "You are a creative storyteller. Write compelling narratives with vivid descriptions."
      };

      const result = await this.generateText(prompt, {
        systemPrompt: systemPrompts[contentType] || systemPrompts.article,
        maxTokens: 2000,
        temperature: 0.8
      });

      return {
        content: result.text,
        type: contentType,
        wordCount: result.text ? result.text.split(/\s+/).length : 0,
        metadata: result.metadata
      };

    } catch (error) {
      logger.error("Creative content generation error:", error);
      throw error;
    }
  }

  // ===============================
  // 🔹 SUMMARIZATION
  // ===============================
  async summarizeText(text, options = {}) {
    try {
      const { length = "medium", style = "bullet" } = options;

      const lengthInstructions = {
        short: "2-3 sentences",
        medium: "1 paragraph (4-6 sentences)",
        long: "2-3 paragraphs"
      };

      const styleInstructions = {
        paragraph: "in paragraph form",
        bullet: "as bullet points"
      };

      const prompt = `Summarize the following text in ${lengthInstructions[length]} ${styleInstructions[style]}:\n\n${text}`;

      const result = await this.generateText(prompt, {
        systemPrompt: "You are an expert summarizer.",
        maxTokens: 1500
      });

      return {
        summary: result.text,
        metadata: result.metadata
      };

    } catch (error) {
      logger.error("Summarization error:", error);
      throw error;
    }
  }

  // ===============================
  // 🔹 CHAT COMPLETION
  // ===============================
  async chatCompletion(messages, options = {}) {
    try {
      const {
        model = "mistralai/mistral-7b-instruct",
        maxTokens = 1000,
        temperature = 0.7,
        systemPrompt = "You are a helpful AI assistant."
      } = options;

      const completion = await this.openai.chat.completions.create({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      });

      return {
        response: completion?.choices?.[0]?.message?.content || "",
        metadata: {
          model,
          usage: completion.usage || {}
        }
      };

    } catch (error) {
      logger.error("Chat completion error:", error);
      throw new Error(`Chat completion failed: ${error.message}`);
    }
  }

  // ===============================
  // 🔹 CREDIT CALCULATION (FIXED)
  // ===============================
  calculateCredits(usage) {
    if (!usage) return 1;

    const totalTokens =
      usage.total_tokens ||
      (usage.prompt_tokens || 0) + (usage.completion_tokens || 0);

    // 1 credit per 1000 tokens (adjust if needed)
    return Math.max(1, Math.ceil(totalTokens / 1000));
  }
}

export default new AIService();
