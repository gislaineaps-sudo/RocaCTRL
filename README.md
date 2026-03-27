# RoçaCtrl - Gestão de Sítios e Agricultura Familiar

Este é um sistema inteligente para gestão de hortas, pomares e pequenos rebanhos, focado no pequeno produtor e agricultura familiar.

## 🚀 Como baixar o código e enviar para o GitHub

Como você está editando aqui no Firebase Studio, o código **ainda não está no seu computador**. Siga estes passos:

### 1. Baixe o código completo
1. No menu superior do Firebase Studio (canto direito), clique no ícone de **Nuvem com Seta para Baixo** (Download Source).
2. Isso vai baixar um arquivo chamado `source.zip` (ou similar) contendo todo o projeto.

### 2. Prepare a pasta no seu computador
1. Abra o arquivo `.zip` baixado.
2. **Copie TODOS** os arquivos e pastas (src, public, package.json, etc.).
3. Vá na sua pasta `C:\Users\silvagi\RocaCTRL`.
4. **Cole tudo lá dentro**. Os arquivos devem ficar direto na pasta `RocaCTRL`, e não dentro de outra subpasta.

### 3. Execute os comandos no Terminal
Abra o terminal na pasta `C:\Users\silvagi\RocaCTRL` e digite:

```bash
# Inicie o Git (se ainda não fez)
git init

# Adicione todos os arquivos que você colou
git add .

# Salve a versão
git commit -m "Initial commit: RoçaCtrl Completo"

# Conecte ao seu GitHub e envie
git remote add origin https://github.com/gislaineaps-sudo/RocaCTRL.git
git branch -M main
git push -u origin main
```

## 🛠️ Configurando o Firebase App Hosting

1. No [Console do Firebase](https://console.firebase.google.com/), ative o **Plano Blaze**.
2. Vá em **App Hosting** e conecte seu repositório.
3. Na configuração da ramificação:
   - **Ramificação ativa**: `main`
   - **Diretório raiz**: `/`

## 💰 Sobre Custos (Plano Blaze)
O App Hosting exige o Plano Blaze, mas o Google oferece uma **Cota Gratuita**. Para o RoçaCtrl (uso em pequena escala), é provável que sua fatura permaneça em **R$ 0,00**, pois o consumo do site será baixo. O upgrade é necessário apenas para habilitar os serviços de nuvem.
