import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rocactrl.app',
  appName: 'RoçaCtrl',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Em desenvolvimento mobile com live-reload, descomente a linha abaixo apontando para o seu IP:
    // url: 'http://192.168.0.15:9002',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F0F4EF',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP'
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#51A329'
    }
  }
};

export default config;
