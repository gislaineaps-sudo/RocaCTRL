# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar. O sistema integra monitoramento IoT, análise climática e um assistente de IA para otimizar a produção em pequenas propriedades.

## ⚠️ CORRIGINDO O ERRO: Git iniciado na pasta errada (C:\Users\...)

Se você viu mensagens de "Permission denied" ou arquivos como "AppData" e "Documents" no terminal (como na sua imagem), siga estes passos para limpar e recomeçar corretamente:

### 1. Remova o Git da sua pasta de usuário
No terminal onde você está (`C:\Users\silvagi`), digite exatamente isto para parar de monitorar seu computador inteiro:
```bash
rd /s /q .git
```

### 2. Crie uma pasta para o projeto e entre nela
Agora, vamos criar um lugar só para o RoçaCtrl:
```bash
mkdir RocaCTRL
cd RocaCTRL
```

### 3. Agora sim, inicialize e envie o código
Agora que você está dentro da pasta `C:\Users\silvagi\RocaCTRL`, siga os passos abaixo:

## 🚀 Como configurar o Git Corretamente

### 1. Inicialize o Repositório Local
```bash
git init
```

### 2. Adicione os Arquivos ao "Stage"
*(Certifique-se de que os arquivos do projeto que você baixou/editou estão dentro desta pasta RocaCTRL)*
```bash
git add .
```

### 3. Faça o Primeiro Commit
```bash
git commit -m "Initial commit: RoçaCtrl MVP com suporte a IoT e IA"
```

### 4. Conecte ao seu GitHub e envie (IMPORTANTE)
```bash
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
   - Clique em **Avançar**.

## ❌ Solução de Problemas no Firebase
Se o Firebase disser que a ramificação não é válida:
1. **Verifique o Push**: Confirme se o comando `git push` no terminal terminou com "Success".
2. **Atualize a Página**: Aguarde 30 segundos e atualize o console do Firebase.

## 💰 Custos e Plano Blaze
O Firebase App Hosting exige o **Plano Blaze**. Embora exija um cartão, o Google oferece uma **cota gratuita** generosa. É muito provável que sua cobrança seja de **R$ 0,00** para uso em pequena escala.
