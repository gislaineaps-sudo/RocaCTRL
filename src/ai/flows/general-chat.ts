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

Pergunta/Mensagem do Produtor (Usuário):
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

function generateFallbackChatResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes("galinha") || msg.includes("ovo") || msg.includes("avicultura") || msg.includes("frango")) {
    return `### 🐔 Manejo de Avicultura Caipira
Para manter uma boa taxa de postura e saúde do lote:
- **Alimentação:** Garanta ração balanceada (16% a 18% de proteína bruta) complementada com pastagem verde (hortaliças, capim picado).
- **Água Limpa:** Bebedouros lavados diariamente com água fresca e à sombra.
- **Ninhos:** Proporção de 1 ninho para cada 4 a 5 poedeiras, em local escuro e com maravalha limpa.
- **Sanidade:** Mantenha vacinação contra New Castle e Bouba Aviária em dia e desinfecção periódica do galinheiro com cal virgem.`;
  }

  if (msg.includes("horta") || msg.includes("alface") || msg.includes("adubo") || msg.includes("canteiro") || msg.includes("praga")) {
    return `### 🌱 Dicas para Manejo da Horta Orgânica
- **Preparo de Solo:** Incorpore de 3 a 5 kg de esterco bovino curtido ou 1 a 2 kg de cama de frango por m² de canteiro.
- **Irrigação:** Prefira gotejamento ou regas suaves de manhã cedo e ao final da tarde.
- **Controle Natural de Pragas:** Utilize calda de fumo com sabão de coco ou extrato de nim para controle preventivo de pulgões e lagartas.
- **Rotação de Culturas:** Alterne folhas (alface, rúcula) com raízes (cenoura, rabanete) e leguminosas (feijão-vagem) para não esgotar o solo.`;
  }

  if (msg.includes("cabra") || msg.includes("ovelha") || msg.includes("ruminante") || msg.includes("leite")) {
    return `### 🐐 Manejo de Pequenos Ruminantes
- **Pasto e Suplementação:** Rotação de piquetes evita acúmulo de verminoses gastrointestinais.
- **Mineralização:** Mantenha cocho coberto com sal mineral específico para ovinos/caprinos sempre disponível.
- **Controle Sanitário:** Acompanhe o escore FAMACHA para controle seletivo de vermífugos e realize vacinação contra clostridioses.`;
  }

  if (msg.includes("peixe") || msg.includes("tilapia") || msg.includes("tanque") || msg.includes("piscicultura")) {
    return `### 🐟 Cuidados na Piscicultura Familiar
- **Qualidade da Água:** Monitore a transparência (disco de Secchi entre 30 e 40cm) e oxigênio dissolvido nas primeiras horas da manhã.
- **Alimentação:** Arraçoe 2 a 3 vezes ao dia com ração extrusada de qualidade, observando se os peixes consomem tudo em até 15 minutos para não sobrar no fundo.`;
  }

  return `### 🌾 Olá, produtor(a)!
Entendi sua dúvida sobre **"${message}"**. No manejo agroecológico e na agricultura familiar, as principais recomendações são:

1. **Acompanhamento Periódico:** Registre as observações no seu banco de dados do **RoçaCtrl** para criar um histórico confiável.
2. **Prevenção e Sanidade:** Acompanhe os alertas de calendário para não perder prazos de vacinação, adubação ou colheita.
3. **Manejo Sustentável:** Priorize adubações orgânicas, cobertura morta nos canteiros e conforto térmico para as criações.

*Precisa de orientações detalhadas sobre alguma cultura, animal ou cálculo de custo específico? Me informe!*`;
}

export async function submitGeneralChat(message: string, historyText: string = ""): Promise<string> {
  // Se a chave não estiver configurada no ambiente, retorna resposta especialista
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('sua_chave')) {
    return generateFallbackChatResponse(message);
  }

  try {
    return await generalChatFlow({ message, historyText });
  } catch (error: any) {
    console.warn("Genkit Chat fallback acionado:", error?.message);
    return generateFallbackChatResponse(message);
  }
}
