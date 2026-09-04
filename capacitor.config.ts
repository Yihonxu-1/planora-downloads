import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.cloverplan.app',
  appName: 'CloverPlan',
  webDir: 'www',
  server: { url: 'https://planora.xyh-devbeat.workers.dev/', cleartext: false, allowNavigation: ['planora.xyh-devbeat.workers.dev'] },
};

export default config;
