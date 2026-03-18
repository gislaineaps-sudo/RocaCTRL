# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar. O sistema integra monitoramento IoT, análise climática e um assistente de IA para otimizar a produção em pequenas propriedades.

## 🚀 Como configurar o Git e Conectar ao GitHub

Siga este passo a passo no seu terminal para enviar o projeto para o seu repositório:

### 1. Inicialize o Repositório Local
```bash
git init
```

### 2. Adicione os Arquivos ao "Stage"
O arquivo `.gitignore` já está configurado para ignorar arquivos desnecessários:
```bash
git add .
```

### 3. Faça o Primeiro Commit
```bash
git commit -m "Initial commit: RoçaCtrl MVP com suporte a IoT e IA"
```

### 4. Conecte ao seu GitHub e envie os arquivos
Execute os comandos abaixo:
```bash
git remote add origin https://github.com/gislaineaps-sudo/RocaCTRL.git
git branch -M main
git push -u origin main
```

## 🛠️ Configurando CI/CD com Firebase App Hosting

Para automatizar o deploy e manter sua aplicação sempre atualizada:

1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. No menu lateral, procure por **App Hosting**.
3. **Importante**: O App Hosting exige que o seu projeto esteja no **Plano Blaze**. Clique em "Fazer upgrade" no console.
4. Clique em "Começar" e conecte sua conta do GitHub.
5. Selecione o repositório `RocaCTRL`.
6. Na tela de **Configurações de implantação** (Passo 3):
   - **Ramificação ativa**: digite `main`
   - **Diretório raiz do app**: deixe `/`
   - Clique em **Avançar**.
7. O Firebase configurará automaticamente um pipeline de CI/CD: cada `git push` na branch `main` disparará um novo build e deploy automático.

## 👀 Como verificar se deu certo?

Após o `git push`, você pode acompanhar o progresso:

1. No **Console do Firebase**, clique em **App Hosting**.
2. Você verá uma seção chamada **Rollouts**.
3. Um item aparecerá com o status "Pendente" ou "Em andamento".
4. Clique no número do Rollout para ver os **Logs de Build** (detalhes técnicos do que está acontecendo).
5. Assim que o status mudar para **Sucesso**, o link oficial do seu site aparecerá no topo da página (ex: `roca-ctrl.web.app`).

## 💰 Custos e Plano Blaze
O Firebase App Hosting requer o **Plano Blaze (pago conforme o uso)**. 
- **Por que o upgrade?** O serviço utiliza recursos como Cloud Run e Cloud Build que exigem esse plano para serem ativados.
- **Vou pagar?** O Google oferece uma **cota gratuita** mensal para esses recursos. Para o uso do RoçaCtrl em uma pequena propriedade ou chácara, é muito provável que seu uso mensal fique **dentro da faixa gratuita**, resultando em uma cobrança de R$ 0,00 na maioria dos meses.

## 📱 Funcionalidades Implementadas
- **Dashboard**: Visão geral com métricas de produção real vs. meta e análise agroclimática.
- **Gestão de Animais**: Organização por categorias e espécies (Avicultura, Piscicultura, etc.).
- **Hortas e Pomares**: Controle de ciclo de vida para agricultura familiar e pequenas áreas.
- **Monitoramento IoT**: Painel de sensores de umidade do solo, temperatura e nível de água.
- **Assistente IA**: Recomendações personalizadas para plantio e manejo de rebanho via Genkit.
- **API de Integração**: Endpoint `/api/stats` para conexões com sistemas externos.