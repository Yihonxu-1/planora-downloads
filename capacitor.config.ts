import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.cloverplan.app',
  appName: 'CloverPlan',
  webDir: 'www',
  plugins: {
    // Sync must use Android's native networking stack. Some mobile networks
    // allow the site in a browser but reset cross-origin WebView requests.
    CapacitorHttp: { enabled: true },
  },
  // The planner UI is bundled into the APK. This makes startup independent of
  // mobile-network access to Cloudflare and prevents WebView timeout screens.
};

export default config;
