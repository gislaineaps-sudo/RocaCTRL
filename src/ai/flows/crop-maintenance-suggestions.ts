'use server';
/**
 * @fileOverview An AI assistant that provides crop maintenance suggestions based on crop growth stage and weather conditions.
 *
 * - cropMaintenanceSuggestions - A function that handles the crop maintenance suggestions process.
 * - CropMaintenanceSuggestionsInput - The input type for the cropMaintenanceSuggestions function.
 * - CropMaintenanceSuggestionsOutput - The return type for the cropMaintenanceSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropMaintenanceSuggestionsInputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., "milho", "soja", "trigo").'),
  growthStage: z.string().describe('The current growth stage of the crop (e.g., "semeadura", "germinação", "vegetativo", "floração", "frutificação").'),
  weatherConditions: z.object({
    temperature: z.number().describe('Current temperature in Celsius.'),
    humidity: z.number().describe('Current humidity percentage.'),
    precipitation: z.number().describe('Precipitation in mm over the last 24 hours.').optional(),
    soilMoisture: z.number().describe('Current soil moisture percentage.').optional(),
  }).describe('Current weather and soil conditions.'),
  notes: z.string().optional().describe('Any additional notes or observations about the crop or environment.'),
});
export type CropMaintenanceSuggestionsInput = z.infer<typeof CropMaintenanceSuggestionsInputSchema>;

const CropMaintenanceSuggestionsOutputSchema = z.object({
  fertilization: z.string().describe('Recommendations for fertilization, including type and timing.'),
  irrigation: z.string().describe('Recommendations for irrigation, including frequency and amount.'),
  pestControl: z.string().describe('Recommendations for pest and disease control.'),
  otherCare: z.string().optional().describe('Other general care recommendations (e.g., weeding, pruning).'),
  summary: z.string().describe('A general summary of the recommendations.'),
});
export type CropMaintenanceSuggestionsOutput = z.infer<typeof CropMaintenanceSuggestionsOutputSchema>;

export async function cropMaintenanceSuggestions(
  input: CropMaintenanceSuggestionsInput
): Promise<CropMaintenanceSuggestionsOutput> {
  return cropMaintenanceSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropMaintenanceSuggestionsPrompt',
  input: {schema: CropMaintenanceSuggestionsInputSchema},
  output: {schema: CropMaintenanceSuggestionsOutputSchema},
  prompt: `Você é um agrônomo especialista e deve fornecer recomendações de manutenção para uma cultura específica.

Baseie suas recomendações na fase de crescimento da cultura e nas condições climáticas fornecidas.
Seja detalhado e prático em suas sugestões para cada categoria (fertilização, irrigação, controle de pragas, etc.).
Considere que o objetivo é garantir a saúde e otimizar a produção da plantação.

Tipo da Cultura: {{{cropType}}}
Fase de Crescimento: {{{growthStage}}}
Condições Climáticas:
  Temperatura: {{{weatherConditions.temperature}}}°C
  Umidade: {{{weatherConditions.humidity}}}%
  Precipitação (últimas 24h): {{{weatherConditions.precipitation}}}mm
  Umidade do Solo: {{{weatherConditions.soilMoisture}}}%

Notas adicionais: {{{notes}}}`,
});

const cropMaintenanceSuggestionsFlow = ai.defineFlow(
  {
    name: 'cropMaintenanceSuggestionsFlow',
    inputSchema: CropMaintenanceSuggestionsInputSchema,
    outputSchema: CropMaintenanceSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
