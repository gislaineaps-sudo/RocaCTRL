'use server';
/**
 * @fileOverview An AI assistant that provides optimized planting recommendations based on soil type and local weather data.
 *
 * - optimizedPlantingRecommendations - A function that handles the planting recommendations process.
 * - OptimizedPlantingRecommendationsInput - The input type for the optimizedPlantingRecommendations function.
 * - OptimizedPlantingRecommendationsOutput - The return type for the optimizedPlantingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizedPlantingRecommendationsInputSchema = z.object({
  soilType: z
    .string()
    .describe(
      'The type of soil, e.g., "argiloso", "arenoso", "humoso", "calcário", etc.'
    ),
  weatherData: z
    .string()
    .describe(
      'Detailed local weather data, e.g., "temperatura média 25°C, precipitação 150mm/mês, umidade 70%, sem previsão de geada nos próximos 3 meses".'
    ),
});
export type OptimizedPlantingRecommendationsInput = z.infer<
  typeof OptimizedPlantingRecommendationsInputSchema
>;

const OptimizedPlantingRecommendationsOutputSchema = z.object({
  cropSuggestions: z
    .array(z.string())
    .describe(
      'A list of suggested crops optimized for the given soil and weather conditions.'
    ),
  plantingSchedule: z
    .string()
    .describe(
      'An optimized planting schedule for the suggested crops, including best times for planting and harvesting.'
    ),
  justification: z
    .string()
    .describe(
      'A detailed explanation of why these crops and schedules were recommended, based on agricultural best practices.'
    ),
});
export type OptimizedPlantingRecommendationsOutput = z.infer<
  typeof OptimizedPlantingRecommendationsOutputSchema
>;

export async function optimizedPlantingRecommendations(
  input: OptimizedPlantingRecommendationsInput
): Promise<OptimizedPlantingRecommendationsOutput> {
  return optimizedPlantingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizedPlantingRecommendationsPrompt',
  input: {schema: OptimizedPlantingRecommendationsInputSchema},
  output: {schema: OptimizedPlantingRecommendationsOutputSchema},
  prompt: `Você é um assistente agrícola especialista em otimização de cultivo e manejo de rebanho. Seu objetivo é fornecer sugestões inteligentes para cronogramas de plantio e seleção de culturas para maximizar a produtividade.

Com base nas seguintes informações de solo e clima, sugira os melhores cultivos e um cronograma de plantio otimizado. Inclua uma justificativa detalhada para as suas recomendações, explicando como elas se alinham às melhores práticas agrícolas e às condições fornecidas.

Tipo de Solo: {{{soilType}}}
Dados Meteorológicos Locais: {{{weatherData}}}`,
});

const optimizedPlantingRecommendationsFlow = ai.defineFlow(
  {
    name: 'optimizedPlantingRecommendationsFlow',
    inputSchema: OptimizedPlantingRecommendationsInputSchema,
    outputSchema: OptimizedPlantingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
