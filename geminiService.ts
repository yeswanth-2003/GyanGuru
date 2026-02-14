
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ComplexityLevel } from "./types";

export const generateTextExplanation = async (topic: string, complexity: ComplexityLevel) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are an expert Machine Learning tutor. Generate a ${complexity} explanation for the topic: "${topic}". 
  Provide clear definitions, key concepts, and practical applications. 
  Structure the response with headings. Do not use markdown symbols like # for headers, use ALL CAPS for major sections instead.`;

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
  const prompt = `Create a conversational audio script for a machine learning lesson about "${topic}". 
  Speak clearly, explain concepts simply, and include helpful pauses indicated by "(Pause)".
  The script should be ready for Text-to-Speech conversion.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  const script = response.text || '';
  
  // Generate the actual audio using the TTS model
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
  
  // 1. Generate descriptive prompts for diagrams
  const promptRequest = `Create 3 distinct technical diagram descriptions for a visual explanation of "${topic}". 
  For example, flowcharts, architecture diagrams, or conceptual illustrations. 
  Format as a JSON array of strings.`;

  const promptResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: promptRequest,
    config: { responseMimeType: "application/json" }
  });

  const prompts: string[] = JSON.parse(promptResponse.text || '[]');
  
  // 2. Generate images for each prompt
  const imageUrls: string[] = [];
  for (const p of prompts) {
    const imgResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Educational diagram, white background, professional style, clear and readable: ${p}` }] },
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

// Audio Decoding Helpers
export const decodeBase64Audio = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
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
