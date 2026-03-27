# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar.

## 🚀 Como configurar o seu computador e enviar para o GitHub

Se você viu a mensagem "O sistema não pode encontrar o arquivo especificado" ou "nothing to commit", siga estes passos exatos:

### 1. Localize o botão de Download
Como você está editando aqui no Firebase Studio, o código **ainda não está no seu computador**.
1. Procure no **canto superior direito** da tela por um ícone de **nuvem com uma seta para baixo** (Download Source).
2. Clique nele para baixar o arquivo `.zip` com todo o seu código atualizado.

### 2. Prepare os arquivos na pasta correta
1. Abra o arquivo `.zip` que você baixou.
2. **Copie todos os arquivos e pastas** (src, public, package.json, etc.) de dentro do zip.
3. Cole-os diretamente dentro da sua pasta: `C:\Users\silvagi\RocaCTRL`.
   - *Importante: Não crie outra pasta RocaCTRL dentro dela. Os arquivos devem estar direto em `C:\Users\silvagi\RocaCTRL`.*

### 3. Execute os comandos no Terminal
Agora que os arquivos estão no lugar certo, abra o terminal e digite estes comandos:

```bash
# 1. Entre na pasta correta
cd C:\Users\silvagi\RocaCTRL

# 2. Inicie o Git
git init

# 3. Adicione os arquivos (agora o comando vai encontrar o que você baixou)
git add .

# 4. Salve a primeira versão
git commit -m "Initial commit: RoçaCtrl MVP com suporte a IoT e IA"

# 5. Conecte ao seu GitHub e envie
git remote add origin https://github.com/gislaineaps-sudo/RocaCTRL.git
git branch -M main
git push -u origin main
```

### 4. O que fazer se der erro?
- **"nothing to commit"**: Significa que a pasta `RocaCTRL` está vazia. Você esqueceu de baixar o código do Firebase Studio e colar lá dentro.
- **"Permission denied"**: Você tentou rodar o comando fora da pasta do projeto. Use o comando `cd C:\Users\silvagi\RocaCTRL` primeiro.

## 🛠️ Configurando o Firebase App Hosting

Para colocar o seu app na internet:

1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. No menu lateral, procure por **App Hosting**.
3. Faça o upgrade para o **Plano Blaze** (Cota gratuita generosa).
4. Conecte seu GitHub e selecione o repositório `RocaCTRL`.
5. Em **Configurações de implantação**:
   - **Ramificação ativa**: digite `main`
   - **Diretório raiz do app**: deixe `/`
