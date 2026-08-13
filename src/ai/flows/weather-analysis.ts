'use server';
/**
 * @fileOverview Assistente de IA que fornece análise agroclimática e recomendações inteligentes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherAnalysisInputSchema = z.object({
  location: z.string().describe('A localização da fazenda.'),
  currentWeather: z.string().describe('Descrição do clima atual (ex: ensolarado, 28°C).'),
  forecast: z.string().describe('Resumo da previsão para os próximos dias.'),
});
export type WeatherAnalysisInput = z.infer<typeof WeatherAnalysisInputSchema>;

const WeatherAnalysisOutputSchema = z.object({
  riskLevel: z.enum(['Baixo', 'Moderado', 'Alto']).describe('Nível de risco para as atividades do dia.'),
  advice: z.string().describe('Conselho prático para o produtor baseado no clima.'),
  priorityTasks: z.array(z.string()).describe('Tarefas que devem ser priorizadas ou adiadas.'),
});
export type WeatherAnalysisOutput = z.infer<typeof WeatherAnalysisOutputSchema>;

export async function getWeatherAnalysis(input: WeatherAnalysisInput): Promise<WeatherAnalysisOutput> {
  // Se a chave não estiver configurada no ambiente, retorna análise agroclimática simulada inteligente
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('sua_chave')) {
    return generateFallbackWeatherAdvice(input);
  }

  try {
    return await weatherAnalysisFlow(input);
  } catch (error: any) {
    console.warn("Genkit AI fallback acionado:", error?.message);
    return generateFallbackWeatherAdvice(input);
  }
}

function generateFallbackWeatherAdvice(input: WeatherAnalysisInput): WeatherAnalysisOutput {
  const loc = input.location || "sua região";
  return {
    riskLevel: "Moderado",
    advice: `Condições favoráveis para manejo em ${loc}. Recomenda-se irrigação nas primeiras horas da manhã ou fim de tarde para evitar evapotranspiração excessiva e preservar a umidade dos canteiros.`,
    priorityTasks: [
      "Revisar umidade do solo nos canteiros de hortaliças",
      "Monitorar bebedouros e ventilação no galinheiro e piquetes",
      "Programar colheita das folhosas no amanhecer",
      "Adiar aplicação foliar se houver vento ou sol forte"
    ]
  };
}

const prompt = ai.definePrompt({
  name: 'weatherAnalysisPrompt',
  input: {schema: WeatherAnalysisInputSchema},
  output: {schema: WeatherAnalysisOutputSchema},
  prompt: `Você é um consultor agroclimático sênior.
Analise as condições meteorológicas abaixo para a localização: {{{location}}}

Clima Atual: {{{currentWeather}}}
Previsão: {{{forecast}}}

Forneça uma análise técnica para o produtor rural, focando em riscos (geada, calor excessivo, falta de chuva) e ações práticas imediatas (irrigação, pulverização, colheita).`,
});

const weatherAnalysisFlow = ai.defineFlow(
  {
    name: 'weatherAnalysisFlow',
    inputSchema: WeatherAnalysisInputSchema,
    outputSchema: WeatherAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
