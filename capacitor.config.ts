import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.herrzatacke.gbprinter',
  appName: 'GB Printer',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;
