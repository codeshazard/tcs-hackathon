// src/services/llm.service.js — Provider-agnostic LLM JSON generator with zod validation
import axios from 'axios';
import { z } from 'zod';
import { env } from '../config/env.js';

const summarySchema = z.object({
  headline: z.string().min(3),
  narrative: z.string().min(20),
  recommendation: z.string().min(10),
});

/**
 * Call Gemini REST API for JSON generation
 */
async function callGeminiApi({ system, user }) {
  const apiKey = env.llmApiKey;
  if (!apiKey) {
    throw new Error('LLM_API_KEY is not configured.');
  }

  const model = env.llmModel || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${system}\n\nINPUT DATA:\n${user}` },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  };

  let response;
  try {
    response = await axios.post(url, payload, {
      timeout: env.llmTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
    });
  } catch (err) {
    console.error('[Gemini Error]', url, err.response?.status, JSON.stringify(err.response?.data || err.message));
    throw err;
  }

  const candidate = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidate) {
    throw new Error('Empty response received from Gemini API');
  }

  return JSON.parse(candidate);
}

/**
 * Call OpenAI-compatible REST API (OpenAI, Groq, OpenRouter)
 */
async function callOpenAiCompatibleApi({ system, user, baseUrl, defaultModel }) {
  const apiKey = env.llmApiKey;
  if (!apiKey) {
    throw new Error('LLM_API_KEY is not configured.');
  }

  const model = env.llmModel || defaultModel;
  const url = `${baseUrl}/chat/completions`;

  const payload = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `INPUT DATA:\n${user}` },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  };

  const response = await axios.post(url, payload, {
    timeout: env.llmTimeoutMs,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response received from LLM API');
  }

  return JSON.parse(content);
}

/**
 * Provider-agnostic JSON generator
 * @param {{ system: string, user: string }} prompts 
 * @returns {Promise<object>}
 */
export async function generateJson({ system, user }) {
  const provider = (env.llmProvider || 'gemini').toLowerCase();

  const runCall = async () => {
    switch (provider) {
      case 'groq':
        return await callOpenAiCompatibleApi({
          system,
          user,
          baseUrl: 'https://api.groq.com/openai/v1',
          defaultModel: 'llama-3.1-8b-instant',
        });
      case 'openai':
        return await callOpenAiCompatibleApi({
          system,
          user,
          baseUrl: 'https://api.openai.com/v1',
          defaultModel: 'gpt-4o-mini',
        });
      case 'openrouter':
        return await callOpenAiCompatibleApi({
          system,
          user,
          baseUrl: 'https://openrouter.ai/api/v1',
          defaultModel: 'google/gemini-flash-1.5',
        });
      case 'gemini':
      default:
        return await callGeminiApi({ system, user });
    }
  };

  // Attempt call with 1 retry on invalid JSON
  try {
    const rawResult = await runCall();
    return summarySchema.parse(rawResult);
  } catch (firstErr) {
    // Retry once if parse or syntax error
    try {
      const retryResult = await runCall();
      return summarySchema.parse(retryResult);
    } catch (secondErr) {
      throw secondErr;
    }
  }
}
