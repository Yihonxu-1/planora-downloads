import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.cloverplan.app',
  appName: 'CloverPlan',
  webDir: 'www',
  server: { url: 'https://cloverplan.94xx.eu.cc/', cleartext: false, allowNavigation: ['cloverplan.94xx.eu.cc'] },
};

export default config;
