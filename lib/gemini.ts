import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. The app will fall back to dynamic mock data.");
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const MODELS = {
  flash: "gemini-2.5-flash",
  pro: "gemini-1.5-pro", // fallback/heavy tasks
};

const isNvidia = apiKey.startsWith("nvapi-");
const isGroq = apiKey.startsWith("gsk_");

/**
 * Helper to fetch text from Groq API Catalog using Llama 3.3 70B
 */
async function generateGroqText(prompt: string, systemInstruction?: string): Promise<string> {
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.2,
      max_tokens: 1500
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Groq API Error: ${errorData.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Helper to fetch structured JSON from Groq API Catalog using Llama 3.3 70B with native JSON Mode
 */
async function generateGroqJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ 
    role: "user", 
    content: `${prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. Do not wrap the JSON in markdown code blocks, do not write markdown formatting, and do not add any explanation. Start directly with '{' and end with '}'.`
  });

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.1,
      max_tokens: 1500,
      response_format: { type: "json_object" } // Groq native JSON enforcement
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Groq API Error: ${errorData.error?.message || res.statusText}`);
  }

  const data = await res.json();
  let text = data.choices?.[0]?.message?.content || "";

  // Strip Markdown JSON formatting wrappers if returned
  text = text.trim();
  if (text.startsWith("```json")) {
    text = text.substring(7);
  } else if (text.startsWith("```")) {
    text = text.substring(3);
  }
  if (text.endsWith("```")) {
    text = text.substring(0, text.length - 3);
  }
  text = text.trim();

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Failed to parse JSON from Groq response:", text, error);
    throw new Error("Invalid JSON structure returned by Llama model on Groq");
  }
}

/**
 * Helper to fetch text from NVIDIA API Catalog using Llama 3.1 8B
 */
async function generateNvidiaText(prompt: string, systemInstruction?: string): Promise<string> {
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages,
      temperature: 0.2,
      max_tokens: 1500
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`NVIDIA API Error: ${errorData.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Helper to fetch structured JSON from NVIDIA API Catalog using Llama 3.1 8B
 */
async function generateNvidiaJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ 
    role: "user", 
    content: `${prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. Do not wrap the JSON in markdown code blocks, do not write markdown formatting, and do not add any explanation. Start directly with '{' and end with '}'.`
  });

  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages,
      temperature: 0.1,
      max_tokens: 1500
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`NVIDIA API Error: ${errorData.error?.message || res.statusText}`);
  }

  const data = await res.json();
  let text = data.choices?.[0]?.message?.content || "";

  // Strip Markdown JSON formatting wrappers if returned
  text = text.trim();
  if (text.startsWith("```json")) {
    text = text.substring(7);
  } else if (text.startsWith("```")) {
    text = text.substring(3);
  }
  if (text.endsWith("```")) {
    text = text.substring(0, text.length - 3);
  }
  text = text.trim();

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Failed to parse JSON from NVIDIA response:", text, error);
    throw new Error("Invalid JSON structure returned by Llama model");
  }
}

/**
 * Generates plain text content using Gemini 2.5 Flash, Groq, or NVIDIA Llama 3.1
 */
export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  if (isGroq) {
    return generateGroqText(prompt, systemInstruction);
  }

  if (isNvidia) {
    return generateNvidiaText(prompt, systemInstruction);
  }

  const model = genAI.getGenerativeModel({
    model: MODELS.flash,
    systemInstruction,
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Generates structured JSON content using Gemini 2.5 Flash, Groq, or NVIDIA Llama 3.1
 */
export async function generateJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  if (isGroq) {
    return generateGroqJSON<T>(prompt, systemInstruction);
  }

  if (isNvidia) {
    return generateNvidiaJSON<T>(prompt, systemInstruction);
  }

  const model = genAI.getGenerativeModel({
    model: MODELS.flash,
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Failed to parse JSON from Gemini response:", text, error);
    throw new Error("Invalid JSON structure returned by model");
  }
}
