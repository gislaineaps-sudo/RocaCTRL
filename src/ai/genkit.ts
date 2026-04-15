import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Lemos a chave APENAS do arquivo .env ou da Vercel (nunca coloque a chave real aqui)
const rawKey = process.env.GEMINI_API_KEY || '';

// Sanitiza a chave para evitar erros de copy-paste na Vercel
const cleanApiKey = rawKey
  ?.replace(/["']/g, '')
  ?.replace('GEMINI_API_KEY=', '')
  ?.trim();

export const ai = genkit({
  plugins: [googleAI({ apiKey: cleanApiKey })],
  model: 'googleai/gemini-2.5-flash',
});
