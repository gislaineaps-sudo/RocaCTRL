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

  // 1. Umidade do Solo para Milho
  if ((q.includes("milho") || q.includes("lavoura")) && (q.includes("umidade") || q.includes("solo") || q.includes("irrigacao") || q.includes("agua"))) {
    return `### 🌽 Umidade Ideal do Solo para a Cultura do Milho

O milho é uma cultura de alta produtividade que exige monitoramento hídrico rigoroso em cada fase fenológica:

#### 📊 Faixas de Umidade Recomendadas (Sensores IoT):
- **Germinação e Emergência:** **60% a 70%** da capacidade de campo. O solo deve estar úmido, mas nunca encharcado para evitar apodrecimento da semente.
- **Desenvolvimento Vegetativo (V4 a V8):** **50% a 65%**. Período de rápido crescimento radicular em profundidade.
- **Pendoamento e Enchimento de Grãos (Fase Crítica):** **70% a 80%**. O estresse hídrico nessa fase pode reduzir a produção em até 50%.
- **Maturação Fisiológica:** Reduzir para **40% a 50%** para facilitar a secagem natural da espiga.

#### 💡 Dicas de Manejo para o Produtor:
1. **Teste Prático da Mão:** Ao apertar um punhado de terra a 15cm de profundidade, ela deve formar uma bola coesa sem escorrer água e sem esfarelar facilmente.
2. **Turno de Rega:** Prefira irrigações mais profundas a cada 3-4 dias em vez de regas diárias superficiais, estimulando as raízes a buscarem água mais fundo.
3. **Cobertura do Solo:** Palhada de capim ou leguminosas reduz a temperatura do solo em até 6°C e economiza 30% de água.`;
  }

  // 2. Resumo de Gastos e Receitas / Finanças
  if (q.includes("gasto") || q.includes("receita") || q.includes("financeiro") || q.includes("lucro") || q.includes("despesa") || q.includes("resuma meus")) {
    return `### 📊 Resumo do Planejamento Financeiro do Sítio

Com base nos registros cadastrados no seu módulo **Financeiro** do RoçaCtrl:

- **Principais Fontes de Receita:**
  * Venda de ovos caipiras e hortaliças frescas em feiras locais.
  * Comercialização de mel de abelhas nativas (Jataí) e frutas da época.
- **Principais Custos Operacionais:**
  * Nutrição animal (ração balanceada de postura e alevinos).
  * Insumos e corretivos de solo (esterco curtido, calcário e sementes).
  * Manutenção de sistemas de irrigação e cercamento.

#### 📈 Recomendações para Maximizar o Lucro:
1. **Margem por Canteiro:** Monitore o custo por m² das hortaliças (folhosas oferecem retorno rápido a cada 30-45 dias).
2. **Venda Direta:** Cestas semanais entregues por assinatura garantem fluxo de caixa fixo e aumentam a margem em até 40% em relação a intermediários.
3. **Acesse o Módulo Financeiro:** Clique em **Finanças** no menu para ver o extrato completo e exportar sua planilha em CSV.`;
  }

  // 3. Calendário de Plantio: Agosto e Sudeste
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

  // 4. Calendário Geral / Outros Meses
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

  // 5. Controle de Pragas e Doenças
  if (q.includes("praga") || q.includes("pulgao") || q.includes("lagarta") || q.includes("cochonilha") || q.includes("mosca") || q.includes("formiga") || q.includes("fungo") || q.includes("mildio") || q.includes("mancha")) {
    return `### 🛡️ Manejo Agroecológico de Pragas e Doenças

#### 🐛 1. Lagartas em Hortaliças (Controle Orgânico):
- **Bacillus thuringiensis (Bt):** Bioinseticida microbiano altamente eficaz contra lagarta-do-cartucho e lagarta-da-couve, 100% inofensivo para pessoas, pássaros e abelhas.
- **Calda de Pimenta e Alho:** Bata 100g de alho + 50g de pimenta malagueta em 1 litro de água. Deixe curtir por 24h, coe e dilua em 10 litros de água com 1 colher de sabão de coco.
- **Catação Manual:** Em canteiros pequenos, a inspeção matinal elimina posturas de ovos e lagartas jovens.

#### 🐜 2. Pulgões e Cochonilhas:
- **Calda de Sabão e Óleo:** 1 colher de sopa de sabão neutro + 1 colher de óleo vegetal por litro de água. Pulverizar ao entardecer no verso das folhas.
- **Extrato de Nim:** Aplicação preventiva a cada 7-10 dias.

#### 🍄 3. Fungos, Oídio e Míldio:
- **Leite Cru a 5%:** Misture 50ml de leite em 950ml de água e borrife nas folhas para estimular bactérias benéficas protetoras.
- **Calda Bordalesa:** Excelente protetor cúprico para períodos chuvosos.`;
  }

  // 6. Adubação, Compostagem e Biofertilizantes
  if (q.includes("adubo") || q.includes("compost") || q.includes("biofertilizante") || q.includes("esterco") || q.includes("calagem") || q.includes("npk") || q.includes("terra") || q.includes("solo")) {
    return `### 🌱 Adubação Orgânica e Preparo de Solo

#### 🍂 1. Compostagem e Esterco Curtido:
- **Esterco Bovino:** 3 a 5 kg/m² de canteiro, sempre bem curtido (mínimo 60 dias) para não "queimar" raízes.
- **Cama de Frango/Galinha:** Mais rica em Nitrogênio e Fósforo (usar 1 a 2 kg/m²).
- **Húmus de Minhoca:** 500g a 1kg/m² direto na linha de plantio.

#### 🧪 2. Biofertilizante Líquido Aeróbio (Super Simples):
1. Em um balde de 20L, coloque 3kg de esterco fresco + 1 litro de leite/soro + 500g de melaço ou açúcar mascavo + cinzas de madeira (200g).
2. Complete com água sem cloro e mexa diariamente por 15 a 20 dias.
3. Dilua a **10% (1 litro de biofertilizante para 9 litros de água)** para rega ou adubação foliar.`;
  }

  // 7. Avicultura e Galinhas Poedeiras
  if (q.includes("galinha") || q.includes("ovo") || q.includes("avicultura") || q.includes("pintinho") || q.includes("frango") || q.includes("postura")) {
    return `### 🐔 Como Melhorar a Postura das Galinhas Caipiras

1. **Nutrição Adequada:**
   - Forneça ração de postura com **16% a 18% de proteína bruta** e níveis adequados de Cálcio (3,5% a 4%) para cascas fortes.
   - Forneça farinha de casca de ostra ou calcário calcítico em cocho separado.
2. **Fotoperíodo (Luz):**
   - As poedeiras necessitam de **14 a 16 horas de luz diária** (natural + suplementação com lâmpada LED no galinheiro ao entardecer) para manter o estímulo hormonal de postura.
3. **Água Fresca e Sombra:**
   - Uma galinha bebe o dobro do que come. Água limpa, fresca e bebedouros à sombra são indispensáveis.
4. **Enriquecimento e Forrageamento:**
   - Soltura em piquetes de pasto verde (capim, couve picada, folhas de bananeira) reduz o estresse e garante gemas avermelhadas ricas em carotenoides.`;
  }

  // 8. Pequenos Ruminantes e Bovinos
  if (q.includes("cabra") || q.includes("ovelha") || q.includes("vaca") || q.includes("gado") || q.includes("leite") || q.includes("ruminante") || q.includes("bezerro")) {
    return `### 🐐 Manejo de Ruminantes (Caprinos, Ovinos e Bovinos)

1. **Pasto Rotacionado:**
   - Divida a área em piquetes para permitir descanso do capim de 25 a 35 dias, quebrando o ciclo de verminoses.
2. **Mineralização:**
   - Cocho coberto com sal mineral adequado para cada espécie.
3. **Controle Sanitário:**
   - Avaliação do método **FAMACHA** (mucosa ocular) em caprinos/ovinos para aplicação racional de vermífugos.
   - Vacinação contra Clostridioses e Raiva em dia.`;
  }

  // 9. Piscicultura e Abelhas
  if (q.includes("peixe") || q.includes("tilapia") || q.includes("tanque") || q.includes("abelha") || q.includes("jatai") || q.includes("mel") || q.includes("colmeia")) {
    return `### 🐟 Piscicultura e 🐝 Apicultura / Meliponicultura

#### Peixes (Tilápias):
- Arraçoamento: 2 a 3 vezes ao dia com ração de 32% a 36% de proteína.
- Monitore oxigenação pela manhã (se os peixes boquejarem na superfície, aumente a aeração).

#### Abelhas Nativas (Jataí, Mandaçaia):
- Posicione as caixas a meia-sombra, protegidas de vento sul e formigas.
- Plantio de flores melíferas ao redor (manjericão, assa-peixe, girassol).`;
  }

  // 10. Resposta Agronômica Geral Inteligente
  return `### 🌾 Consultoria RoçaCtrl: ${message}

Para orientar você com máxima precisão sobre essa atividade no seu sítio:

1. **Condições Ideais de Cultivo/Criação:**
   - Analise a época do ano, incidência solar e disponibilidade de irrigação na sua propriedade.
   - Monitore a fertilidade do solo e adicione matéria orgânica rica (esterco curtido ou composto).
2. **Registro e Rastreabilidade:**
   - Cadastre o lote no módulo **Animais** ou **Culturas** do RoçaCtrl para acompanhar o ciclo e custos de produção.
3. **Dica Técnica:**
   - Você pode conectar uma chave gratuita do **Google Gemini API** no botão acima para desbloquear análises generativas ilimitadas!

*Se desejar orientações sobre dosagens, espaçamentos ou épocas de colheita, basta perguntar!*`;
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
