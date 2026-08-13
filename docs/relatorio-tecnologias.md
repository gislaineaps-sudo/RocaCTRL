# Relatório de Tecnologias Utilizadas - RoçaCtrl - https://roca-ctrl.vercel.app/

O **RoçaCtrl** é uma plataforma inovadora voltada para a gestão de sítios e agricultura familiar, construída sob rigorosos padrões modernos de desenvolvimento Web e Inteligência Artificial. Abaixo está o mapeamento da arquitetura técnica e de todas as bibliotecas e frameworks principais que sustentam o sistema no seu estado atual.

---

## 🏗️ Core & Framework

A fundação do projeto foi arquitetada utilizando as mais recentes ferramentas do ecossistema JavaScript para garantir segurança tipada, performance e renderização instantânea:

*   **Next.js (v15.5.9):** Utilizamos a versão mais recente do framework da Vercel trabalhando em modo **Turbopack** (agilizando significativamente o tempo de recarga durante o desenvolvimento). O Next atua como o principal orquestrador de páginas (usando a nova arquitetura *App Router*) garantindo carregamentos rápidos e estabilidade no SEO.
*   **React (v19):** Biblioteca núcleo para a construção das interfaces declarativas.
*   **TypeScript (v5.X):** Implementamos a checagem de tipos estática por toda a base de código, garantindo a prevenção contra *runtime errors* e agilizando as refatorações. 

## 🤖 Inteligência Artificial (Módulo Assistente Agro)

O sistema de conversação, previsão climática e aconselhamento inteligente do RoçaCtrl está fundado em uma arquitetura de IA autônoma e atualizada:

*   **Google Genkit (v1.28):** O framework open-source mais robusto do Google para montagem de fluxos (flows) de Generative AI, permitindo modularidade, tracing e segurança nas inferências. Utiliza o package atualizado `@genkit-ai/google-genai`.
*   **Gemini 2.5 Flash:** O projeto foi configurado com um dos modelos fundacionais multimodais mais rápidos e recentes da atualidade (`gemini-2.5-flash`), fornecendo baixa latência combinada às fortes habilidades de raciocínio lógico focado em agricultura e botânica.

## 🎨 Interface Visual (UI & UX)

Priorizamos uma interface moderna, amigável para todos os níveis de letramento digital, acessível e responsiva:

*   **Tailwind CSS (v3.4):** Framework utilitário de CSS que proporciona estilizações rápidas, adaptáveis (Mobile/Desktop) com designs limpos e eficientes.
*   **Componentes Radix UI / Acessibilidade:** O alicerce dos menus, tabelas, modais flutuantes, barras laterais acessíveis etc. Eles garantem que a nossa interface atenda aos padrões globais de acessibilidade visual.
*   **Lucide React:** Uma biblioteca abrangente e levíssima para ícones SVG em tempo de execução, permitindo ilustrar perfeitamente funções ligadas ao agronegócio.
*   **Recharts:** Tecnologias responsáveis pelas representações gráficas (gráficos de clima, lucros e safra) em formato de mapas SVG responsivos.

## 💾 Backend, Banco de Dados e Integrações

*   **Firebase SDK (v11):** O motor backend responsável pela administração de banco de dados em tempo real, gestão de sessões de usuário, armazenamentos escaláveis de documentos e proteção da base de dados do sistema no ecossistema de nuvem (Cloud).

## 🔒 Gerenciamento de Formulários

O sistema valida toda a entrada de dados (como valores sobre plantio, contas a pagar, sensores) antes de comunicar com o banco de dados:

*   **React Hook Form:** Permite gerenciamento rápido da entrada de dados dos usuários sem re-renderizar todo o layout.
*   **Zod:** Um poderoso validador de esquemas e tipos integrado diretamente nos fluxos para assegurar que as "regras de negócios" – como números mínimos, máximos e strings obrigatórias – sejam rigidamente respeitadas tanto no cliente quanto interpeladas pela IA.
