import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.cloverplan.app',
  appName: 'CloverPlan',
  webDir: 'www',
  // The planner UI is bundled into the APK. This makes startup independent of
  // mobile-network access to Cloudflare and prevents WebView timeout screens.
};

export default config;
