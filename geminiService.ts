
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ComplexityLevel } from "./types";

/**
 * World-class service for interacting with Gemini models.
 * Each function initializes a new GoogleGenAI instance to ensure the latest API key is used.
 */

export const generateTextExplanation = async (topic: string, complexity: ComplexityLevel) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are an expert Machine Learning tutor. Generate a ${complexity} explanation for the topic: "${topic}". 
  Provide clear definitions, key concepts, and practical applications. 
  Structure the response with headings. Use ALL CAPS for section titles.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const generateCodeImplementation = async (topic: string, complexity: ComplexityLevel) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a Python implementation for "${topic}" at a ${complexity} level. 
  Include detailed comments explaining each part of the code. 
  The response should first list required libraries as a comma-separated list on a single line starting with "DEPENDENCIES:", then provide the code block.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  const text = response.text || '';
  const depsMatch = text.match(/DEPENDENCIES:\s*(.*)/);
  const dependencies = depsMatch ? depsMatch[1].split(',').map(s => s.trim()) : [];
  const codeMatch = text.match(/```python\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1] : '';
  const explanation = text.replace(/```python[\s\S]*?```/, '').replace(/DEPENDENCIES:.*(\n|$)/, '').trim();

  return { code, dependencies, explanation };
};

export const generateAudioLesson = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const scriptPrompt = `Create a conversational audio script for a machine learning lesson about "${topic}". 
  Speak clearly, explain concepts simply, and keep it under 2 minutes.`;
  
  const scriptResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: scriptPrompt,
  });

  const script = scriptResponse.text || '';
  
  const ttsResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this script cheerfully: ${script}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return { script, base64Audio };
};

export const generateVisualDiagrams = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const promptRequest = `Create 3 distinct technical diagram descriptions for a visual explanation of "${topic}". 
  Format as a JSON array of strings.`;

  const promptResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: promptRequest,
    config: { responseMimeType: "application/json" }
  });

  const prompts: string[] = JSON.parse(promptResponse.text || '[]');
  
  const imageUrls: string[] = [];
  for (const p of prompts) {
    const imgResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High quality educational machine learning diagram, clean lines, professional white background: ${p}` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    for (const part of imgResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrls.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }
  }

  return { prompts, imageUrls };
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
