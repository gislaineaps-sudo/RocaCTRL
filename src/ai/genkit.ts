import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Fallback direto pra salvar a apresentação caso a Vercel continue não enxergando a variável
const fallbackKey = "AIzaSyCZWjlQSzdLapN7BGEhBvxd1har4SBnisw";
const rawKey = process.env.GEMINI_API_KEY || fallbackKey;

// Sanitiza a chave para evitar erros de copy-paste na Vercel
const cleanApiKey = rawKey
  ?.replace(/["']/g, '')
  ?.replace('GEMINI_API_KEY=', '')
  ?.trim();

export const ai = genkit({
  plugins: [googleAI({ apiKey: cleanApiKey })],
  model: 'googleai/gemini-2.5-flash',
});
