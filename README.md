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
Execute os comandos abaixo (certifique-se de que o repositório `RocaCTRL` já foi criado no seu GitHub):
```bash
git remote add origin https://github.com/gislaineaps-sudo/RocaCTRL.git
git branch -M main
git push -u origin main
```

## 🛠️ Configurando CI/CD com Firebase App Hosting

Para automatizar o deploy e manter sua aplicação sempre atualizada:

1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. No menu lateral, procure por **App Hosting**.
3. Clique em "Começar" e conecte sua conta do GitHub.
4. Selecione o repositório `RocaCTRL`.
5. O Firebase configurará automaticamente um pipeline de CI/CD: cada `git push` na branch `main` disparará um novo build e deploy automático para a URL de produção.

## 📱 Funcionalidades Implementadas
- **Dashboard**: Visão geral com métricas de produção real vs. meta e análise agroclimática.
- **Gestão de Animais**: Organização por categorias e espécies (Avicultura, Piscicultura, etc.).
- **Hortas e Pomares**: Controle de ciclo de vida para agricultura familiar e pequenas áreas.
- **Monitoramento IoT**: Painel de sensores de umidade do solo, temperatura e nível de água.
- **Assistente IA**: Recomendações personalizadas para plantio e manejo de rebanho via Genkit.
- **API de Integração**: Endpoint `/api/stats` para conexões com sistemas externos.
