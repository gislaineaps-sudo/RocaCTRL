'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GeneralChatInputSchema = z.object({
  message: z.string().describe('The current user message'),
  historyText: z.string().describe('The formatted conversation history')
});

const prompt = ai.definePrompt({
  name: 'generalChatPrompt',
  input: {schema: GeneralChatInputSchema},
  prompt: `Você é o Engenheiro Agrônomo e Consultor Especialista do RoçaCtrl, focado em agricultura familiar, sítios, agroecologia, hortas, fruticultura e pequenos rebanhos no Brasil.
Responda sempre em Português do Brasil, de forma clara, técnica, acolhedora e prática para o produtor rural.
Use formatação Markdown com títulos, listas com marcadores e negrito para destacar informações críticas de manejo, época de plantio, dosagens e precauções.

Histórico da conversa (se houver):
{{{historyText}}}

Pergunta/Dúvida do Produtor:
{{{message}}}

Sua Resposta Especialista:`
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

// -------------------------------------------------------------
// BASE DE CONHECIMENTO AGRONÔMICA ESPECIALISTA OFFLINE (FALLBACK)
// -------------------------------------------------------------

function generateFallbackChatResponse(message: string): string {
  const q = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. Calendário de Plantio: Agosto e Sudeste
  if ((q.includes("agosto") || q.includes("inverno") || q.includes("fim de inverno")) && (q.includes("sudeste") || q.includes("sp") || q.includes("mg") || q.includes("rj") || q.includes("es") || q.includes("plantar") || q.includes("cultura"))) {
    return `### 🌾 Calendário de Plantio: Sudeste em Agosto

Agosto no Sudeste marca a transição do final do inverno para a primavera. Com dias ficando mais longos e temperaturas em gradual elevação, é uma época excelente para iniciar sementeiras de culturas de primavera/verão e colher hortaliças de clima ameno:

#### 🥬 1. Hortaliças Folhosas e de Raiz (Semeadura Direta e Canteiros):
- **Alface (todas as variedades):** Germinação rápida; manter rega constante.
- **Rúcula, Agrião e Espinafre:** Excelente desenvolvimento com noites amenas.
- **Cenoura e Beterraba:** Semeie cultivares de meia-estação/verão (ex: Cenoura Brasília/Kuronoda).
- **Rabanete e Nabo:** Ciclo super rápido (25 a 35 dias para colheita).
- **Couve Manteiga:** Plantio por mudas ou estaquia de brotos laterais.

#### 🍅 2. Frutos e Legumes (Início de Sementeiras para a Primavera):
- **Tomate (Cereja, Italiano, Débora):** Ideal semear em bandejas protegidas para transplantar em setembro.
- **Pimentão e Pimentas (Dedo-de-moça, Biquinho, Cumari):** Exigem calor para germinar; manter sementeira aquecida.
- **Berinjela e Jiló:** Iniciar formação de mudas.
- **Abobrinha Italiana e Abóbora Menina:** Semeadura direta em covas adubadas com esterco curtido.
- **Feijão-Vagem e Pepino:** Instalar tutoramento (estacas ou mourões com arame).

#### 🌽 3. Grãos e Grandes Culturas:
- **Milho Verde e Feijão das Águas:** Preparar o solo com calagem e matéria orgânica para semear no final de agosto / início de setembro com as primeiras chuvas.

#### 💡 Dicas de Manejo em Agosto:
1. **Irrigação:** Agosto costuma ter baixa umidade relativa do ar. Regue no início da manhã ou fim da tarde (gotejamento é o mais recomendado).
2. **Mulching (Cobertura Morta):** Cubra os canteiros com palhada ou capim seco para reter a umidade e proteger a microbiota do solo.
3. **Preparo de Mudas:** Use bandejas de 128 ou 200 células com substrato enriquecido com húmus de minhoca.`;
  }

  // 2. Calendário Geral / Outros Meses
  if (q.includes("calendario") || q.includes("epoca de plantio") || q.includes("o que plantar")) {
    return `### 📅 Guia Rápido de Épocas de Plantio (Brasil)

- **Primavera/Verão (Setembro a Março):**
  * *Culturas de Calor:* Tomate, pimentão, abóboras, melancia, quiabo, milho, feijão, berinjela, feijão-de-corda, mandioca.
- **Outono/Inverno (Abril a Agosto):**
  * *Culturas de Clima Ameno:* Alface, rúcula, espinafre, brócolis, couve-flor, cenoura, beterraba, rabanete, alho-poró, ervilha, morango, cebola.
- **O Ano Todo (com irrigação):**
  * Couve, cebolinha, salsinha, coentro, manjericão, alecrim, hortelã, rabanete.

*Dica: Especifique seu estado ou mês para um detalhamento sob medida!*`;
  }

  // 3. Controle de Pragas e Doenças
  if (q.includes("praga") || q.includes("pulgao") || q.includes("lagarta") || q.includes("cochonilha") || q.includes("mosca") || q.includes("formiga") || q.includes("fungo") || q.includes("mildio") || q.includes("mancha")) {
    return `### 🛡️ Manejo Agroecológico de Pragas e Doenças

#### 🐜 1. Pulgões e Cochonilhas:
- **Calda de Sabão e Óleo:** Misture 1 colher de sopa de detergente neutro (ou sabão de coco ralado) + 1 colher de sopa de óleo vegetal em 1 litro de água. Pulverize no final da tarde, embaixo das folhas.
- **Extrato de Nim:** Aplicação semanal de óleo de nim a 0,5% a 1%.

#### 🐛 2. Lagartas e Vaquinhas:
- **Calda de Fumo com Pimenta:** Macere 50g de fumo de corda e 3 pimentas malaguetas em 1 litro de água por 48h. Coe e dilua 1 copo para cada 5 litros de água.
- **Bacillus thuringiensis (Bt):** Bioinseticida seletivo que elimina apenas lagartas sem afetar abelhas e joaninhas.

#### 🍄 3. Fungos, Oídio e Míldio:
- **Calda Bordalesa:** Solução clássica à base de sulfato de cobre e cal virgem (excelente para tomates, citros e videiras).
- **Leite Cru a 5%:** Misture 50ml de leite cru em 950ml de água e pulverize semanalmente para controle preventivo de oídio.

#### 🐜 4. Formigas Cortadeiras:
- Iscas à base de gergelim preto ou extrato de folhas de nim espalhadas próximas aos olheiros.`;
  }

  // 4. Adubação, Compostagem e Biofertilizantes
  if (q.includes("adubo") || q.includes("compost") || q.includes("biofertilizante") || q.includes("esterco") || q.includes("calagem") || q.includes("npk") || q.includes("terra") || q.includes("solo")) {
    return `### 🌱 Adubação Orgânica e Preparo de Solo

#### 🍂 1. Compostagem e Esterco Curtido:
- **Esterco Bovino:** 3 a 5 kg/m² de canteiro, sempre bem curtido (mínimo 60 dias) para não "queimar" raízes.
- **Cama de Frango/Galinha:** Mais rica em Nitrogênio e Fósforo (usar 1 a 2 kg/m²).
- **Húmus de Minhoca:** 500g a 1kg/m² direto na linha de plantio.

#### 🧪 2. Biofertilizante Líquido Aeróbio (Super Simples):
1. Em um balde de 20L, coloque 3kg de esterco fresco + 1 litro de leite/soro + 500g de melaço ou açúcar mascavo + cinzas de madeira (200g).
2. Complete com água sem cloro e mexa diariamente por 15 a 20 dias.
3. Dilua a **10% (1 litro de biofertilizante para 9 litros de água)** para rega ou adubação foliar.

#### 🪵 3. Cinzas de Madeira (Fonte de Potássio e Cálcio):
- 100g a 150g por m² aumentam a doçura dos frutos, fortalecem o caule e repelem pragas rasteiras.`;
  }

  // 5. Avicultura e Galinhas Poedeiras
  if (q.includes("galinha") || q.includes("ovo") || q.includes("avicultura") || q.includes("pintinho") || q.includes("frango")) {
    return `### 🐔 Manejo Eficiente de Avicultura Caipira

1. **Alimentação Balanceada:**
   - 100g a 120g de ração de postura (16% a 18% proteína bruta) por ave/dia.
   - Forneça verde à vontade (folhas de couve, capim mombaça/tífton, rami, guandu).
2. **Ninhos e Coleta de Ovos:**
   - 1 ninho para cada 4 a 5 poedeiras, local escuro e ventilado, com palha/maravalha trocada quinzenalmente.
   - Colete os ovos pelo menos 2 vezes ao dia (às 10h e às 16h) para evitar quebras e bicagem.
3. **Sanidade Preventiva:**
   - Vacinação contra New Castle, Bouba Aviária e Gumboro.
   - Vermifugação periódica com sementes de abóbora trituradas ou fitoterápicos à base de alho na água.`;
  }

  // 6. Pequenos Ruminantes e Bovinos
  if (q.includes("cabra") || q.includes("ovelha") || q.includes("vaca") || q.includes("gado") || q.includes("leite") || q.includes("ruminante") || q.includes("bezerro")) {
    return `### 🐐 Manejo de Ruminantes (Caprinos, Ovinos e Bovinos)

1. **Pasto Rotacionado:**
   - Divida a área em piquetes para permitir descanso do capim de 25 a 35 dias, quebrando o ciclo de verminoses.
2. **Mineralização:**
   - Cocho coberto com sal mineral adequado para cada espécie (atenção: sal de bovino tem alto cobre e pode intoxicar ovinos!).
3. **Controle Sanitário:**
   - Avaliação do método **FAMACHA** (mucosa ocular) em caprinos/ovinos para aplicação racional de vermífugos.
   - Vacinação contra Clostridioses e Raiva em dia.`;
  }

  // 7. Piscicultura e Abelhas
  if (q.includes("peixe") || q.includes("tilapia") || q.includes("tanque") || q.includes("abelha") || q.includes("jatai") || q.includes("mel") || q.includes("colmeia")) {
    return `### 🐟 Piscicultura e 🐝 Apicultura / Meliponicultura

#### Peixes (Tilápias):
- Arraçoamento: 2 a 3 vezes ao dia com ração de 32% a 36% de proteína.
- Monitore oxigenação pela manhã (se os peixes boquejarem na superfície, aumente a aeração ou troque parte da água).

#### Abelhas Nativas (Jataí, Mandaçaia):
- Posicione as caixas a meia-sombra, protegidas de vento sul e formigas (use graxa no suporte).
- Plantio de flores melíferas ao redor (manjericão, assa-peixe, girassol, cosmo).`;
  }

  // 8. Resposta Agronômica Geral Inteligente
  return `### 🌾 Consultoria RoçaCtrl: ${message}

Para orientar você com máxima precisão sobre essa atividade no seu sítio:

1. **Condições Ideais de Cultivo/Criação:**
   - Analise a época do ano, incidência solar e disponibilidade de irrigação na sua propriedade.
   - Monitore a fertilidade do solo e adicione matéria orgânica rica (esterco curtido ou composto).
2. **Registro e Rastreabilidade:**
   - Cadastre o lote no módulo **Animais** ou **Culturas** do RoçaCtrl para acompanhar o ciclo e custos de produção.
3. **Dica Técnica:**
   - Você pode cadastrar uma chave gratuita do **Google Gemini API** em *Configurações* ou no botão acima para habilitar respostas generativas personalizadas em tempo real!

*Se quiser aprofundar sobre espaçamento, adubação, dosagens ou controle de pragas, pode perguntar!*`;
}

// -------------------------------------------------------------
// SUBMISSÃO DO CHAT COM SUPORTE A CHAVE DINÂMICA
// -------------------------------------------------------------

export async function submitGeneralChat(
  message: string,
  historyText: string = "",
  customApiKey?: string
): Promise<string> {
  const activeKey = customApiKey?.trim() || process.env.GEMINI_API_KEY?.trim();

  // Se tivermos uma chave válida, executamos o Genkit / Google Gemini 2.5 Flash
  if (activeKey && !activeKey.includes('sua_chave') && activeKey.length > 10) {
    try {
      const dynamicAi = genkit({
        plugins: [googleAI({ apiKey: activeKey })],
        model: 'googleai/gemini-2.5-flash',
      });

      const dynamicPrompt = dynamicAi.definePrompt({
        name: `chat_${Date.now()}`,
        input: { schema: GeneralChatInputSchema },
        prompt: `Você é o Engenheiro Agrônomo e Consultor Especialista do aplicativo RoçaCtrl, focado em agricultura familiar, sítios, agroecologia, hortas, fruticultura e pequenos rebanhos no Brasil.
Responda sempre em Português do Brasil de forma rica, prática, técnica e humanizada.
Use formatação Markdown com títulos (###), tópicos, tabelas e negrito.

Histórico da conversa:
{{{historyText}}}

Pergunta do Produtor:
{{{message}}}

Sua Resposta:`
      });

      const { text } = await dynamicPrompt({ message, historyText });
      if (text && text.trim()) {
        return text;
      }
    } catch (error: any) {
      console.warn("Falha ao chamar Gemini com chave informada, acionando base de conhecimento agronômica:", error?.message);
    }
  }

  // Fallback inteligente completo
  return generateFallbackChatResponse(message);
}
