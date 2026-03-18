# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar.

## 🚀 Como configurar o seu computador e enviar para o GitHub

O erro **"nothing to commit"** que você viu acontece porque a pasta no seu computador está vazia. Siga estes passos exatos:

### 1. Obtenha os arquivos do projeto
Como você está editando aqui no Firebase Studio, você precisa baixar o código para o seu computador primeiro:
- Clique no botão de **Download** (ícone de nuvem com seta ou "Download Source") aqui na interface do Firebase Studio para baixar o arquivo `.zip`.
- Extraia (descompacte) todo o conteúdo desse arquivo `.zip` para dentro da sua pasta: `C:\Users\silvagi\RocaCTRL`.

### 2. Configure o Git corretamente
Agora que os arquivos estão na pasta, abra o terminal e digite:

```bash
# Certifique-se de estar na pasta certa (onde você extraiu os arquivos)
cd C:\Users\silvagi\RocaCTRL

# Inicie o Git
git init

# Adicione todos os arquivos (agora eles existem!)
git add .

# Salve a primeira versão
git commit -m "Initial commit: RoçaCtrl MVP com suporte a IoT e IA"

# Conecte ao seu GitHub e envie
git remote add origin https://github.com/gislaineaps-sudo/RocaCTRL.git
git branch -M main
git push -u origin main
```

## 🛠️ Configurando CI/CD com Firebase App Hosting

Para automatizar o deploy:

1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. No menu lateral, procure por **App Hosting**.
3. Faça o upgrade para o **Plano Blaze**.
4. Conecte sua conta do GitHub e selecione o repositório `RocaCTRL`.
5. Na tela de **Configurações de implantação**:
   - **Ramificação ativa**: digite `main`
   - **Diretório raiz do app**: deixe `/`

## 💰 Custos e Plano Blaze
O Firebase App Hosting exige o **Plano Blaze**. Embora exija um cartão para verificação, o Google oferece uma **cota gratuita** generosa. É muito provável que sua cobrança seja de **R$ 0,00** para uso em pequena escala.