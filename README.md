# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar. O sistema integra monitoramento IoT, análise climática e um assistente de IA para otimizar a produção em pequenas propriedades.

## 🚀 Como configurar o Git e Conectar ao GitHub

Siga este passo a passo no seu terminal para enviar o projeto para o seu repositório:

### 1. Inicialize o Repositório Local
```bash
git init
```

### 2. Adicione os Arquivos ao "Stage"
```bash
git add .
```

### 3. Faça o Primeiro Commit
```bash
git commit -m "Initial commit: RoçaCtrl MVP com suporte a IoT e IA"
```

### 4. Conecte ao seu GitHub e envie os arquivos (IMPORTANTE)
**Atenção:** Você precisa executar estes comandos ANTES de configurar o Firebase:
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
5. Na tela de **Configurações de implantação** (Passo 3):
   - **Ramificação ativa**: digite `main`
   - **Diretório raiz do app**: deixe `/`
   - Clique em **Avançar**.

## ❌ Resolvendo o Erro: "O nome da ramificação precisa se referir a uma ramificação válida"

Se você vir uma mensagem vermelha dizendo que a ramificação não é válida (como na imagem que você viu), siga estes passos:

1. **Verifique o Push**: Volte ao seu terminal e confirme se você rodou o comando `git push -u origin main`. O Firebase só reconhece a branch `main` se ela já existir no GitHub.
2. **Atualize a Página**: Se você acabou de dar o push, aguarde 30 segundos e atualize a página do console do Firebase.
3. **Verifique o Nome**: No terminal, digite `git branch`. O nome que aparecer com um asterisco (ex: `* main`) é o que você deve digitar no campo do Firebase.

## 👀 Como verificar se deu certo?

Após o sucesso na configuração:
1. No **Console do Firebase**, clique em **App Hosting**.
2. Acompanhe o status em **Rollouts**.
3. Assim que o status mudar para **Sucesso**, seu link (ex: `roca-ctrl.web.app`) estará ativo!

## 💰 Custos e Plano Blaze
O Firebase App Hosting exige o **Plano Blaze**. Embora exija um cartão para verificação, o Google oferece uma **cota gratuita** generosa. Para o uso do RoçaCtrl em pequena escala, é muito provável que sua cobrança mensal seja de **R$ 0,00**.
