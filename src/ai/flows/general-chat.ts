'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralChatInputSchema = z.object({
  message: z.string().describe('The current user message'),
  historyText: z.string().describe('The formatted conversation history')
});

const prompt = ai.definePrompt({
  name: 'generalChatPrompt',
  input: {schema: GeneralChatInputSchema},
  prompt: `Você é um consultor agrônomo amigável da ferramenta RoçaCtrl, focado em agricultura familiar, hortas, pequenos rebanhos e clima.
Seja conselheiro, prestativo e forneça boas práticas do campo baseadas nas perguntas do usuário.
Responda sempre utilizando Markdown quando for utilizar listas ou grifar elementos importantes.

Histórico da conversa (se houver):
{{{historyText}}}

Pergunta/Mensagem do Gendeiro (Usuário):
{{{message}}}

Sua Resposta:`
});

const generalChatFlow = ai.defineFlow(
  {
    name: 'generalChatFlow',
    inputSchema: GeneralChatInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    const {text} = await prompt(input);
    return text;
  }
);

export async function submitGeneralChat(message: string, historyText: string = ""): Promise<string> {
  try {
    return await generalChatFlow({ message, historyText });
  } catch (error: any) {
    console.error("Vercel Chat Error:", error);
    return `Desculpe, ocorreu um erro técnico ao comunicar com a IA: ${error?.message || "Erro Desconhecido"}`;
  }
}
