# Guia de Publicação Mobile: RoçaCtrl nas Lojas de Aplicativos (Google Play & App Store)

O **RoçaCtrl** foi transformado para operar tanto como um **PWA (Progressive Web App)** de instalação instantânea quanto como um **Aplicativo Nativo** pronto para compilação via **Capacitor** para as lojas oficiais da **Google Play Store (Android)** e **Apple App Store (iOS)**.

---

## 📱 Opção 1: Instalação Instantânea PWA (Sem necessidade de Loja)

O RoçaCtrl já possui `manifest.json`, `Service Worker (sw.js)` e meta tags móveis configurados:

1. Acesse o aplicativo no celular (ex: `https://roca-ctrl.vercel.app/` ou via rede local).
2. **No Android (Chrome):**
   - Um botão *"Instalar RoçaCtrl no Celular"* surgirá no topo da tela.
   - Ou clique nos 3 pontinhos do Chrome e selecione **"Instalar aplicativo"** / **"Adicionar à tela inicial"**.
3. **No iPhone/iPad (iOS Safari):**
   - Clique no ícone de **Compartilhar** (quadrado com seta para cima no rodapé do Safari).
   - Role e selecione **"Adicionar à Tela de Início"**.
4. O app será executado em tela cheia (modo standalone), com ícone próprio e navegação inferior ergonômica.

---

## 🚀 Opção 2: Gerar APK e AAB para Google Play Store (Via Capacitor)

Para publicar na Google Play Store como aplicativo nativo `.aab` / `.apk`:

### 1. Instalar as dependências do Capacitor
No terminal do projeto, execute:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/app @capacitor/splash-screen @capacitor/status-bar
```

### 2. Inicializar a pasta Android
```bash
npx cap add android
```

### 3. Sincronizar o projeto web com o Android
```bash
# Caso queira exportar uma build estática ou apontar para a URL da Vercel:
npx cap sync
```

### 4. Abrir no Android Studio
```bash
npx cap open android
```
- O **Android Studio** será aberto com o projeto nativo configurado.
- Para gerar o arquivo de teste: vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
- Para publicar na Play Store: vá em **Build > Generate Signed Bundle / APK > Android App Bundle (.aab)**, insira sua chave de assinatura (*Keystore*) e envie o arquivo `.aab` gerado para o [Google Play Console](https://play.google.com/console).

---

## 🍏 Opção 3: Publicar na Apple App Store (iOS via Xcode)

*(Requer macOS com Xcode instalado)*

1. No terminal do projeto, execute:
```bash
npm install @capacitor/ios
npx cap add ios
npx cap sync
```
2. Abra o projeto no Xcode:
```bash
npx cap open ios
```
3. Selecione seu time de desenvolvedor Apple em **Signing & Capabilities**.
4. Conecte um iPhone ou use o Simulador para testar.
5. Em **Product > Archive**, gere a build de produção e faça o upload direto para o **App Store Connect**.

---

## ⚡ Opção 4: Publicação Rápida via PWABuilder (Recomendada para Play Store)

Se você preferir gerar o pacote da Google Play Store diretamente a partir da URL publicada:

1. Acesse **[PWABuilder.com](https://www.pwabuilder.com/)**.
2. Digite a URL de produção do RoçaCtrl: `https://roca-ctrl.vercel.app/`.
3. O PWABuilder verificará o `manifest.json` e o `sw.js` (que já criamos).
4. Clique em **"Package for Stores" > "Android"**.
5. Baixe o pacote `.zip` gerado que já contém o arquivo `.aab` pronto para subir no **Google Play Console** sem precisar compilar manualmente!

---

## 🎨 Recursos Visuais Incluídos:
- Barra inferior de navegação móvel (`Bottom Navigation Bar`)
- Suporte a Safe Area (entalhes e notch de iPhone e Android modernos)
- Temas e cores nativas do campo: Verde `#51A329` e Fundo `#F0F4EF`
- Acessibilidade e modo de alto contraste para trabalho sob a luz do sol
