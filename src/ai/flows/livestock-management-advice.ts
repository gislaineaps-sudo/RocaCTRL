'use server';
/**
 * @fileOverview An AI assistant for providing livestock management advice.
 *
 * - getLivestockManagementAdvice - A function that handles the livestock management advice process.
 * - LivestockManagementAdviceInput - The input type for the getLivestockManagementAdvice function.
 * - LivestockManagementAdviceOutput - The return type for the getLivestockManagementAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LivestockManagementAdviceInputSchema = z.object({
  species: z.string().describe('The species of the animal (e.g., "cattle", "sheep", "chicken").'),
  ageInMonths: z.number().int().min(0).describe('The age of the animal in months.'),
});
export type LivestockManagementAdviceInput = z.infer<typeof LivestockManagementAdviceInputSchema>;

const LivestockManagementAdviceOutputSchema = z.object({
  feedingPlan: z.string().describe('A detailed feeding plan tailored to the animal.'),
  healthAlerts: z.array(z.string()).describe('A list of potential health alerts or preventative measures.'),
  generalAdvice: z.string().describe('General management advice for the animal.'),
});
export type LivestockManagementAdviceOutput = z.infer<typeof LivestockManagementAdviceOutputSchema>;

export async function getLivestockManagementAdvice(
  input: LivestockManagementAdviceInput
): Promise<LivestockManagementAdviceOutput> {
  return livestockManagementAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'livestockManagementAdvicePrompt',
  input: {schema: LivestockManagementAdviceInputSchema},
  output: {schema: LivestockManagementAdviceOutputSchema},
  prompt: `Você é um especialista em manejo de gado e animais rurais. Forneça sugestões de manejo para um animal com as seguintes características:

Espécie: {{{species}}}
Idade em meses: {{{ageInMonths}}}

Sua sugestão deve incluir um plano de alimentação detalhado, alertas de saúde ou medidas preventivas, e conselhos gerais de manejo para manter o animal saudável e produtivo.`,
});

const livestockManagementAdviceFlow = ai.defineFlow(
  {
    name: 'livestockManagementAdviceFlow',
    inputSchema: LivestockManagementAdviceInputSchema,
    outputSchema: LivestockManagementAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
