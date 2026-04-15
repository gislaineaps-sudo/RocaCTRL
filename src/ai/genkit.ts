import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Sanitiza a chave para evitar erros de copy-paste na Vercel (espaços, aspas, ou "KEY=" duplicado)
const cleanApiKey = process.env.GEMINI_API_KEY
  ?.replace(/["']/g, '')
  ?.replace('GEMINI_API_KEY=', '')
  ?.trim();

export const ai = genkit({
  plugins: [googleAI({ apiKey: cleanApiKey })],
  model: 'googleai/gemini-2.5-flash',
});
