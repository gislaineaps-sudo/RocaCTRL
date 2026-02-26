# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar.

## 🚀 Como configurar o Git e Conectar ao GitHub

Para versionar seu código e habilitar o deploy automático (CI/CD), siga estes passos no terminal:

### 1. Inicialize o Repositório Local
```bash
git init
```

### 2. Adicione os Arquivos
```bash
git add .
```

### 3. Faça o Primeiro Commit
```bash
git commit -m "Initial commit: RoçaCtrl MVP"
```

### 4. Conecte ao GitHub
1. Crie um novo repositório vazio no seu GitHub.
2. Copie a URL do repositório (ex: `https://github.com/seu-usuario/rocactrl.git`).
3. No terminal, execute:
```bash
git remote add origin https://github.com/seu-usuario/rocactrl.git
git branch -M main
git push -u origin main
```

## 🛠️ Configurando CI/CD com Firebase App Hosting

O arquivo `apphosting.yaml` já está presente na raiz. Para automatizar o deploy:

1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. Selecione seu projeto.
3. No menu lateral, procure por **App Hosting**.
4. Clique em **Começar** e conecte sua conta do GitHub.
5. Selecione o repositório `rocactrl` que você acabou de criar.
6. Siga os passos de configuração. A partir daí, cada `git push` na branch `main` disparará um novo build e deploy automático.

## 📱 Funcionalidades Implementadas
- **Dashboard**: Visão geral com métricas de produção.
- **Gestão de Animais**: Cadastro por categoria e espécie.
- **Hortas e Pomares**: Controle de ciclo de vida de plantas.
- **Assistente IA**: Recomendações personalizadas via Genkit.
- **Monitoramento IoT**: Painel de sensores simulados.
- **API de Integração**: Endpoint `/api/stats` disponível.
