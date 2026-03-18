# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar.

## 🚀 Como configurar o Git e Conectar ao GitHub

Como sou uma IA, não consigo executar comandos diretamente no seu computador, mas preparei todos os arquivos necessários. Siga este passo a passo no seu terminal:

### 1. Inicialize o Repositório Local
```bash
git init
```

### 2. Adicione os Arquivos ao "Stage"
Agora que o `.gitignore` foi criado, você pode adicionar tudo sem medo:
```bash
git add .
```

### 3. Faça o Primeiro Commit
```bash
git commit -m "Initial commit: RoçaCtrl MVP com suporte a IoT e IA"
```

### 4. Conecte ao seu GitHub
1. Crie um repositório vazio no seu [GitHub](https://github.com/new).
2. Execute (substituindo a URL pela sua):
```bash
git remote add origin https://github.com/seu-usuario/rocactrl.git
git branch -M main
git push -u origin main
```

## 🛠️ Configurando CI/CD com Firebase App Hosting

Para automatizar o deploy:

1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. No menu lateral, procure por **App Hosting**.
3. Conecte sua conta do GitHub e selecione o repositório `rocactrl`.
4. Cada `git push` na branch `main` disparará um novo build e deploy automático.

## 📱 Funcionalidades Implementadas
- **Dashboard**: Visão geral com métricas de produção real vs. meta.
- **Gestão de Animais**: Organização por categorias e espécies.
- **Hortas e Pomares**: Controle de ciclo de vida para agricultura familiar.
- **Monitoramento IoT**: Painel de sensores de umidade e nível de água.
- **Assistente IA**: Recomendações personalizadas via Genkit e análise climática.
- **API de Integração**: Endpoint `/api/stats` para conexões externas.