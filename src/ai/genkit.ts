import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Chave fixa de fallback para garantir sucesso absoluto na apresentação
const cleanApiKey = "AIzaSyCZWjlQSzdLapN7BGEhBvxd1har4SBnisw";

export const ai = genkit({
  plugins: [googleAI({ apiKey: cleanApiKey })],
  model: 'googleai/gemini-2.5-flash',
});
