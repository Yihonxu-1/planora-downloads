import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.cloverplan.app',
  appName: 'CloverPlan',
  webDir: 'www',
  // Open the actual planner route directly.  The root route is useful for a
  // browser landing page but is not a reliable entry point for Android WebView.
  server: { url: 'https://planora.xyh-devbeat.workers.dev/app/', cleartext: false, allowNavigation: ['planora.xyh-devbeat.workers.dev'] },
};

export default config;
