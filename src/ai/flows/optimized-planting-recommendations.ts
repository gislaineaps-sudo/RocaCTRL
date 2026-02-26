'use server';
/**
 * @fileOverview An AI assistant that provides optimized planting recommendations based on soil type and local weather data, focused on family farming and small holdings.
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
      'O tipo de solo, ex: "argiloso", "arenoso", "compostado", etc.'
    ),
  weatherData: z
    .string()
    .describe(
      'Dados meteorológicos locais ou descrição do clima da chácara/sítio.'
    ),
});
export type OptimizedPlantingRecommendationsInput = z.infer<
  typeof OptimizedPlantingRecommendationsInputSchema
>;

const OptimizedPlantingRecommendationsOutputSchema = z.object({
  cropSuggestions: z
    .array(z.string())
    .describe(
      'Lista de cultivos sugeridos (hortaliças, frutíferas, ervas) para pequena escala.'
    ),
  plantingSchedule: z
    .string()
    .describe(
      'Cronograma de plantio otimizado para o pequeno produtor.'
    ),
  justification: z
    .string()
    .describe(
      'Justificativa focada em agricultura familiar e aproveitamento de espaço.'
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
  prompt: `Você é um assistente agrícola especialista em agricultura familiar, hortas urbanas e pequenos sítios/chácaras. Seu objetivo é ajudar o pequeno produtor a diversificar sua produção e aproveitar cada metro quadrado de terra.

Com base nas seguintes informações de solo e clima, sugira os melhores cultivos (priorizando hortaliças, árvores frutíferas de pequeno/médio porte, ervas medicinais e temperos) e um cronograma de manejo simplificado. 

Inclua uma justificativa detalhada explicando como essas escolhas ajudam na sustentabilidade da propriedade e na segurança alimentar da família ou pequena comercialização.

Tipo de Solo: {{{soilType}}}
Dados Meteorológicos: {{{weatherData}}}`,
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
