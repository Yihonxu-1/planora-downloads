import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.cloverplan.app',
  appName: 'CloverPlan',
  webDir: 'www',
  // Use the custom China-facing domain and open the planner route directly.
  // workers.dev times out on some mainland mobile networks.
  server: { url: 'https://cloverplan.94xx.eu.cc/app/', cleartext: false, allowNavigation: ['cloverplan.94xx.eu.cc'] },
};

export default config;
