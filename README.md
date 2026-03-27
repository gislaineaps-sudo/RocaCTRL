# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar.

## 🚀 Como configurar o seu computador e enviar para o GitHub

Se você viu a mensagem "O sistema não pode encontrar o arquivo especificado" ou "nothing to commit", siga estes passos exatos:

### 1. Prepare os arquivos (O passo mais importante!)
Como você está editando aqui no Firebase Studio, o código **ainda não está no seu computador**.
1. Clique no botão de **Download** (ícone de nuvem com seta ou "Download Source") aqui no canto superior do Firebase Studio.
2. Você vai baixar um arquivo `.zip`.
3. Abra esse `.zip` e **extraia/copie todos os arquivos** para dentro da sua pasta: `C:\Users\silvagi\RocaCTRL`.

### 2. Configure o Git corretamente no Terminal
Agora que os arquivos estão na pasta, abra o terminal e digite estes comandos um por um:

```bash
# 1. Entre na pasta onde você colocou os arquivos
cd C:\Users\silvagi\RocaCTRL

# 2. Inicie o Git (apenas nesta pasta!)
git init

# 3. Adicione os arquivos (agora o comando vai encontrar os arquivos que você baixou)
git add .

# 4. Salve a primeira versão
git commit -m "Initial commit: RoçaCtrl MVP com suporte a IoT e IA"

# 5. Conecte ao seu GitHub e envie (use o link do SEU repositório)
git remote add origin https://github.com/gislaineaps-sudo/RocaCTRL.git
git branch -M main
git push -u origin main
```

### 3. O que fazer se der erro?
- **"nothing to commit"**: Significa que a pasta `RocaCTRL` está vazia. Você esqueceu de baixar o código do Firebase Studio e colar lá dentro.
- **"fatal: remote origin already exists"**: Digite `git remote remove origin` e depois tente o passo 5 novamente.

## 🛠️ Configurando CI/CD com Firebase App Hosting

Para automatizar o deploy:

1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. No menu lateral, procure por **App Hosting**.
3. Faça o upgrade para o **Plano Blaze** (Cota gratuita generosa, geralmente R$ 0,00 para este app).
4. Conecte sua conta do GitHub e selecione o repositório `RocaCTRL`.
5. Na tela de **Configurações de implantação**:
   - **Ramificação ativa**: digite `main`
   - **Diretório raiz do app**: deixe `/`
